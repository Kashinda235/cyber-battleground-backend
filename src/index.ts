import 'dotenv/config';
import { app } from './app.js';
import http from 'http';
import {attachWebSocketServer} from "./ws/server.js";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const {
  broadcastPlayerJoined,
  broadcastPlayerLeft,
  broadcastPerformedAction,
  broadcastGameState,
  broadcastMessage } = attachWebSocketServer(server);

app.locals.broadcastPlayerJoined = broadcastPlayerJoined;
app.locals.broadcastPlayerLeft = broadcastPlayerLeft;
app.locals.broadcastPerformedAction = broadcastPerformedAction;
app.locals.broadcastGameState = broadcastGameState;
app.locals.broadcastMessage = broadcastMessage;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});
