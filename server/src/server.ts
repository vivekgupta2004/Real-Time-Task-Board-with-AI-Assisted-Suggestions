import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';
import { initializeSocket } from './socket/socket';
import { startKeepAlive } from './utils/keepAlive';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startKeepAlive();
  });
};

startServer();

