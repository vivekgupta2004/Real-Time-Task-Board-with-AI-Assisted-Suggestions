import Task, { ITask } from '../models/task.model';
import { emitToUser, getIO } from '../socket/socket';
import { createNotification } from './notification.service';
import { AppError } from '../utils/appError';
import { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation';

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
    const io = getIO();
    io.emit(eventName, payload);
  } catch (error) {
    console.error(`Failed to emit socket event ${eventName}:`, error);
  }
};

export const createTask = async (userId: string, data: CreateTaskInput): Promise<ITask> => {
  const dueDate = new Date(data.dueDate);
  const task = await Task.create({
    ...data,
    dueDate,
    owner: userId,
  });

  notifyTaskEvent(userId, 'task:created', {
    event: 'task:created',
    data: task,
  });

  await checkAndNotifyDueSoon(userId, task.title, dueDate);

  return task;
};

export const getUserTasks = async (userId: string): Promise<ITask[]> => {
  const tasks = await Task.find({ owner: userId }).sort({ createdAt: -1 });
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

  const updateFields: Record<string, any> = { ...data };
  if (data.dueDate) {
    updateFields.dueDate = new Date(data.dueDate);
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
    new: true,
    runValidators: true,
  });

  notifyTaskEvent(userId, 'task:updated', {
    event: 'task:updated',
    data: updatedTask,
  });

  if (data.status === 'completed' && task.status !== 'completed') {
    await createNotification({
      userId,
      title: 'Task Completed',
      message: `Your task '${updatedTask!.title}' has been completed.`,
      type: 'completed',
    });
  }

  if (updatedTask && updatedTask.dueDate) {
    await checkAndNotifyDueSoon(userId, updatedTask.title, updatedTask.dueDate);
  }

  return updatedTask!;
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
