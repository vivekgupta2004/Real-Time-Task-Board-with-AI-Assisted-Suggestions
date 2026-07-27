import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
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
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           example: pending
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
 *         status:
 *           type: string
 *           enum: [pending, completed]
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
 *         dueDate:
 *           type: string
 *           format: date-time
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
 *     summary: Get all tasks for the authenticated user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Unauthorized
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
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateRequest(createTaskSchema), createTask);

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task by ID
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
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not task owner)
 *       404:
 *         description: Task not found
 */
router.put('/:id', validateRequest(updateTaskSchema), updateTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
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
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not task owner)
 *       404:
 *         description: Task not found
 */
router.delete('/:id', deleteTask);

export default router;
