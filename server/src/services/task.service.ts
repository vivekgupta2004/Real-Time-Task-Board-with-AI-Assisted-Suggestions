import Task, { ITask } from '../models/task.model';
import { emitToUser, getIO } from '../socket/socket';
import { AppError } from '../utils/appError';
import { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation';

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
  const task = await Task.create({
    ...data,
    dueDate: new Date(data.dueDate),
    owner: userId,
  });

  notifyTaskEvent(userId, 'task:created', {
    event: 'task:created',
    data: task,
  });

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
