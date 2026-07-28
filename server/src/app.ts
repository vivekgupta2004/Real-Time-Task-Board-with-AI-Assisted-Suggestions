import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger';
import { AppError } from './utils/appError';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import notificationRoutes from './routes/notification.routes';
import aiRoutes from './routes/ai.routes';

const app: Application = express();

const allowedOrigins = [
  'https://real-time-task-board-with-ai-assist.vercel.app',
  'https://real-time-task-board-with-ai-assist.vercel.app/',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health Check Endpoint
 *     responses:
 *       200:
 *         description: Task Board API is running successfully
 */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Task Board API is running',
  });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/notifications', notificationRoutes);
app.use('/ai', aiRoutes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
});

app.use(errorHandler);

export default app;
