import Task, { ITask } from '../models/task.model';
import { emitToUser } from '../socket/socket';
import { createNotification } from './notification.service';
import { AppError } from '../utils/appError';
import { CreateTaskInput, UpdateTaskInput, CreateSubtaskInput, UpdateSubtaskInput } from '../validations/task.validation';

const priorityWeight: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

const checkAndNotifyDueSoon = async (userId: string, taskTitle: string, dueDate: Date): Promise<void> => {
  const now = new Date();
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  if (dueDate > now && dueDate <= twentyFourHoursLater) {
    await createNotification({
      userId,
      title: 'Task Due Soon',
      message: `Your task '${taskTitle}' is due within the next 24 hours.`,
      type: 'due_soon',
    });
  }
};

const notifyTaskEvent = (userId: string, eventName: string, payload: any): void => {
  try {
    emitToUser(userId, eventName, payload);
  } catch (error) {
    console.error(`Failed to emit socket event ${eventName}:`, error);
  }
};

const recalculateSubtaskStatus = async (userId: string, task: ITask): Promise<void> => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return;
  }

  const previousStatus = task.status;
  const total = task.subtasks.length;
  const completedCount = task.subtasks.filter((s: any) => s.completed).length;

  if (completedCount === 0) {
    task.status = 'pending';
    task.completedAt = null;
  } else if (completedCount < total) {
    task.status = 'in_progress';
    task.completedAt = null;
  } else {
    task.status = 'completed';
    if (!task.completedAt) {
      task.completedAt = new Date();
    }
  }

  if (previousStatus !== 'completed' && task.status === 'completed') {
    await createNotification({
      userId,
      title: 'Task Completed',
      message: `Your task '${task.title}' has been completed.`,
      type: 'completed',
    });
  }
};

export const createTask = async (userId: string, data: CreateTaskInput): Promise<ITask> => {
  const dueDate = new Date(data.dueDate);
  if (isNaN(dueDate.getTime()) || dueDate <= new Date()) {
    throw new AppError('Due date must be in the future', 400);
  }

  const initialSubtasks =
    data.subtasks && Array.isArray(data.subtasks)
      ? data.subtasks.map((s) => ({
          title: s.title,
          completed: s.completed || false,
          completedAt: s.completed ? new Date() : null,
        }))
      : [];

  const task = new Task({
    title: data.title,
    description: data.description,
    priority: data.priority || 'medium',
    dueDate,
    status: 'pending',
    completedAt: null,
    owner: userId,
    subtasks: initialSubtasks,
  });

  if (initialSubtasks.length > 0) {
    await recalculateSubtaskStatus(userId, task);
  }

  await task.save();

  notifyTaskEvent(userId, 'task:created', {
    event: 'task:created',
    data: task,
  });

  await checkAndNotifyDueSoon(userId, task.title, dueDate);

  return task;
};

export const getUserTasks = async (
  userId: string,
  filters?: { status?: string; priority?: string }
): Promise<ITask[]> => {
  const query: Record<string, any> = { owner: userId };
  if (filters?.status) {
    query.status = filters.status;
  }
  if (filters?.priority) {
    query.priority = filters.priority;
  }

  const tasks = await Task.find(query);

  tasks.sort((a, b) => {
    // 1. Pending/In_Progress tasks first, Completed tasks at the bottom
    if (a.status !== b.status) {
      if (a.status === 'completed') return 1;
      if (b.status === 'completed') return -1;
    }

    // 2. Sort by Due Date & Due Time ascending (nearest deadline first)
    const dA = new Date(a.dueDate).getTime();
    const dB = new Date(b.dueDate).getTime();
    if (dA !== dB) {
      return dA - dB;
    }

    // 3. Priority: High -> Medium -> Low
    const pA = priorityWeight[a.priority || 'medium'] || 2;
    const pB = priorityWeight[b.priority || 'medium'] || 2;
    if (pA !== pB) {
      return pA - pB;
    }

    // 4. Created At descending (newest first)
    const crA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const crB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return crB - crA;
  });

  return tasks;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to update this task', 403);
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.priority !== undefined) task.priority = data.priority;
  if (data.dueDate !== undefined) {
    const newDueDate = new Date(data.dueDate);
    if (isNaN(newDueDate.getTime()) || newDueDate <= new Date()) {
      throw new AppError('Due date must be in the future', 400);
    }
    task.dueDate = newDueDate;
  }

  if (data.subtasks !== undefined && Array.isArray(data.subtasks)) {
    task.subtasks = data.subtasks.map((s: any) => ({
      ...(s._id ? { _id: s._id } : {}),
      title: s.title,
      completed: s.completed || false,
      completedAt: s.completed ? new Date() : null,
    })) as any;
    await recalculateSubtaskStatus(userId, task);
  }

  await task.save();

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: task,
  });

  if (task.dueDate) {
    await checkAndNotifyDueSoon(userId, task.title, task.dueDate);
  }

  return task;
};

export const completeTask = async (userId: string, taskId: string): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to complete this task', 403);
  }

  if (task.status === 'completed') {
    throw new AppError('Task is already completed', 400);
  }

  const utcNow = new Date();
  task.status = 'completed';
  task.completedAt = utcNow;

  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((s: any) => {
      s.completed = true;
      s.completedAt = utcNow;
    });
  }

  await task.save();

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: task,
  });

  await createNotification({
    userId,
    title: 'Task Completed',
    message: `Your task '${task.title}' has been completed.`,
    type: 'completed',
  });

  return task;
};

export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to delete this task', 403);
  }

  await task.deleteOne();

  notifyTaskEvent(userId, 'task:deleted', {
    event: 'task:deleted',
    data: {
      taskId,
    },
  });
};

export const addSubtask = async (
  userId: string,
  taskId: string,
  data: CreateSubtaskInput
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to modify this task', 403);
  }

  task.subtasks.push({
    title: data.title,
    completed: false,
    completedAt: null,
  } as any);

  await recalculateSubtaskStatus(userId, task);
  await task.save();

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: task,
  });

  return task;
};

export const updateSubtask = async (
  userId: string,
  taskId: string,
  subtaskId: string,
  data: UpdateSubtaskInput
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to modify this task', 403);
  }

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) {
    throw new AppError('Subtask not found', 404);
  }

  if (data.title !== undefined) {
    subtask.title = data.title;
  }

  if (data.completed !== undefined) {
    subtask.completed = data.completed;
    subtask.completedAt = data.completed ? new Date() : null;
  }

  await recalculateSubtaskStatus(userId, task);
  await task.save();

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: task,
  });

  return task;
};

export const deleteSubtask = async (
  userId: string,
  taskId: string,
  subtaskId: string
): Promise<ITask> => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (task.owner.toString() !== userId) {
    throw new AppError('You do not have permission to modify this task', 403);
  }

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) {
    throw new AppError('Subtask not found', 404);
  }

  task.subtasks.pull(subtaskId);

  await recalculateSubtaskStatus(userId, task);
  await task.save();

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: task,
  });

  return task;
};
