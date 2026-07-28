import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
  };
}

let io: Server | null = null;

export const initializeSocket = (server: HttpServer): Server => {
  const allowedOrigins = [
    'https://real-time-task-board-with-ai-assist.vercel.app',
    'https://real-time-task-board-with-ai-assist.vercel.app/',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN,
  ].filter(Boolean) as string[];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  });


  // Socket.IO JWT Authentication Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const authHeader =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;

      if (!authHeader) {
        return next(new Error('Authentication token missing'));
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Authentication failed'));
    }
  });

  // Socket Connection & Realtime Event Listeners
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.data.userId;
    console.log(`Socket Connected: ${socket.id} (User: ${userId})`);

    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('task:join', (boardId: string) => {
      if (boardId) {
        socket.join(`board:${boardId}`);
      }
    });

    socket.on('task:leave', (boardId: string) => {
      if (boardId) {
        socket.leave(`board:${boardId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, payload: any): void => {
  try {
    if (io) {
      io.to(`user:${userId}`).emit(event, payload);
    }
  } catch (error) {
    console.error(`Failed to emit socket event ${event} to user ${userId}:`, error);
  }
};
