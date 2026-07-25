import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes.js';
import { gameRoutes } from './routes/gameRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

const allowedOrigin = process.env.FRONTEND_URL;
if (!allowedOrigin) {
    throw new Error('FRONTEND_URL must be set to configure CORS');
}
app.use(cors({ origin: allowedOrigin }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.send('Hello from Game server!');
});

app.use('/auth', authRoutes);
app.use('/', gameRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
