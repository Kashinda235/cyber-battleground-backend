import express from 'express';
import { authRoutes } from './routes/authRoutes.js';
import { gameRoutes } from './routes/gameRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.send('Hello from Game server!');
});

app.use('/auth', authRoutes);
app.use('/game', gameRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
