import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await taskService.createTask(req.user!._id.toString(), req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const tasks = await taskService.getUserTasks(req.user!._id.toString(), {
      status: typeof status === 'string' ? status : undefined,
      priority: typeof priority === 'string' ? priority : undefined,
    });
    res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = await taskService.updateTask(req.user!._id.toString(), taskId, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = await taskService.completeTask(req.user!._id.toString(), taskId);
    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await taskService.deleteTask(req.user!._id.toString(), taskId);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
    const task = await taskService.addSubtask(req.user!._id.toString(), taskId, req.body);
    res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
    const subtaskId = Array.isArray(req.params.subtaskId) ? req.params.subtaskId[0] : req.params.subtaskId;
    const task = await taskService.updateSubtask(req.user!._id.toString(), taskId, subtaskId, req.body);
    res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubtask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
    const subtaskId = Array.isArray(req.params.subtaskId) ? req.params.subtaskId[0] : req.params.subtaskId;
    const task = await taskService.deleteSubtask(req.user!._id.toString(), taskId, subtaskId);
    res.status(200).json({
      success: true,
      message: 'Subtask deleted successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
