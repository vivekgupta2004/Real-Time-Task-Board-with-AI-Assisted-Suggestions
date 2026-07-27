import Task, { ITask } from '../models/task.model';
import { AppError } from '../utils/appError';
import { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation';

export const createTask = async (userId: string, data: CreateTaskInput): Promise<ITask> => {
  const task = await Task.create({
    ...data,
    dueDate: new Date(data.dueDate),
    owner: userId,
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
};
