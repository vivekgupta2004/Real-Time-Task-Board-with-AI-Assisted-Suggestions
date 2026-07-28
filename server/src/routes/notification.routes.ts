import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *           example: due_soon
 *         isRead:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Fetch notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/', notificationController.getNotifications);

/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read for the authenticated user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a single notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch('/:id/read', notificationController.markAsRead);

export default router;
