import Task, { ITask } from '../models/task.model';
import { emitToUser } from '../socket/socket';
import { createNotification } from './notification.service';
import { AppError } from '../utils/appError';
import { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation';

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

export const createTask = async (userId: string, data: CreateTaskInput): Promise<ITask> => {
  const dueDate = new Date(data.dueDate);
  if (isNaN(dueDate.getTime()) || dueDate <= new Date()) {
    throw new AppError('Due date must be in the future', 400);
  }

  const task = await Task.create({
    title: data.title,
    description: data.description,
    priority: data.priority || 'medium',
    dueDate,
    status: 'pending',
    completedAt: null,
    owner: userId,
  });

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
    // 1. Pending tasks first, Completed tasks at the bottom
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
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

  const updateFields: Record<string, any> = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.description !== undefined) updateFields.description = data.description;
  if (data.priority !== undefined) updateFields.priority = data.priority;
  if (data.dueDate !== undefined) {
    const newDueDate = new Date(data.dueDate);
    if (isNaN(newDueDate.getTime()) || newDueDate <= new Date()) {
      throw new AppError('Due date must be in the future', 400);
    }
    updateFields.dueDate = newDueDate;
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
    new: true,
    runValidators: true,
  });

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: updatedTask,
  });

  if (updatedTask && updatedTask.dueDate) {
    await checkAndNotifyDueSoon(userId, updatedTask.title, updatedTask.dueDate);
  }

  return updatedTask!;
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
