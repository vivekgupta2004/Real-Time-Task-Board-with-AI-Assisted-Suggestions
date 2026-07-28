import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  createSubtaskSchema,
  updateSubtaskSchema,
} from '../validations/task.validation';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     Subtask:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateSubtaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Write Auth Integration Tests
 *     UpdateSubtaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Updated Subtask Title
 *         completed:
 *           type: boolean
 *           example: true
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - dueDate
 *       properties:
 *         title:
 *           type: string
 *           example: Complete Project Setup
 *         description:
 *           type: string
 *           example: Complete initial backend setup and endpoints
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: 2026-12-31T23:59:59.000Z
 *     UpdateTaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         dueDate:
 *           type: string
 *           format: date-time
 *     TaskResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         subtasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subtask'
 *         owner:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Get all tasks for authenticated user with pagination, search, filter, and sort
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *         description: Number of tasks per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive title search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, in_progress, completed]
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [all, low, medium, high]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate, priority, title]
 *           default: createdAt
 *         description: Field to sort tasks by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Tasks fetched successfully with pagination metadata
 */
router.get('/', getTasks);


/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', validateRequest(createTaskSchema), createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', validateRequest(updateTaskSchema), updateTask);

/**
 * @openapi
 * /tasks/{id}/complete:
 *   patch:
 *     summary: Mark a task as completed
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task completed successfully
 */
router.patch('/:id/complete', completeTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:id', deleteTask);

/**
 * @openapi
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: Add a subtask to a task
 *     tags:
 *       - Subtasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubtaskInput'
 *     responses:
 *       201:
 *         description: Subtask added successfully
 */
router.post('/:taskId/subtasks', validateRequest(createSubtaskSchema), addSubtask);

/**
 * @openapi
 * /tasks/{taskId}/subtasks/{subtaskId}:
 *   patch:
 *     summary: Update title or completion status of a subtask
 *     tags:
 *       - Subtasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubtaskInput'
 *     responses:
 *       200:
 *         description: Subtask updated successfully
 */
router.patch('/:taskId/subtasks/:subtaskId', validateRequest(updateSubtaskSchema), updateSubtask);

/**
 * @openapi
 * /tasks/{taskId}/subtasks/{subtaskId}:
 *   delete:
 *     summary: Delete a subtask
 *     tags:
 *       - Subtasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subtask deleted successfully
 */
router.delete('/:taskId/subtasks/:subtaskId', deleteSubtask);

export default router;
