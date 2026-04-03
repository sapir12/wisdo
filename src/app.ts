import express from 'express';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import feedRoutes from './routes/feed.routes';
import { errorHandler } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use(authRoutes);
  app.use('/books', bookRoutes);
  app.use('/feed', feedRoutes);

  app.use(errorHandler);

  return app;
}
