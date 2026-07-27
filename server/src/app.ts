import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { setupSwagger } from './config/swagger';
import { AppError } from './utils/appError';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
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

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
});

app.use(errorHandler);

export default app;
