import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { gameRoutes } from './routes/gameRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/', gameRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
