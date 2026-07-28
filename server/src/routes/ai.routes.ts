import { Router } from 'express';
import { getTaskSuggestion } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { taskSuggestionSchema } from '../validations/ai.validation';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     TaskSuggestionInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Build Real-Time Task Manager
 *         description:
 *           type: string
 *           example: Create a full-stack task management application using Next.js, Express, Socket.IO and Firebase.
 *     TaskSuggestionSubtasksResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             subtasks:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Design database schema
 *                   completed:
 *                     type: boolean
 *                     example: false
 */

/**
 * @openapi
 * /ai/task-suggestion:
 *   post:
 *     summary: Generate AI-suggested subtasks using Google Gemini
 *     tags:
 *       - AI Suggestions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskSuggestionInput'
 *     responses:
 *       200:
 *         description: AI subtask suggestions generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskSuggestionSubtasksResponse'
 *       400:
 *         description: Validation failed (Title required)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: AI service or Gemini API error
 */
router.post('/task-suggestion', validateRequest(taskSuggestionSchema), getTaskSuggestion);

export default router;
