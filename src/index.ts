import 'dotenv/config';
import { app } from './app.js';
import http from 'http';
import {attachWebSocketServer} from "./ws/server.js";
import {db} from "./db/db.js";
import {players} from "./db/schema.js";
import {startBotEngine} from "./game/botServer.js";
import {ne} from "drizzle-orm";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

const {
  broadcastPlayerJoined,
  broadcastPlayerLeft,
  broadcastPerformedAction,
  broadcastGameState,
  broadcastMessage,
  broadcastSendMail,
} = attachWebSocketServer(server);

app.locals.broadcastPlayerJoined = broadcastPlayerJoined;
app.locals.broadcastPlayerLeft = broadcastPlayerLeft;
app.locals.broadcastPerformedAction = broadcastPerformedAction;
app.locals.broadcastGameState = broadcastGameState;
app.locals.broadcastMessage = broadcastMessage;
app.locals.broadcastSendMail = broadcastSendMail;

async function startServer() {
  try {
    console.log("[DB] Resetting stale player statuses...");
    await db.update(players).set({ status: 'offline' });
    console.log("[DB] All players marked offline.");

    server.listen(PORT, HOST, async () => {
      const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

      console.log(`Server is running on ${baseUrl}`);
      console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);

      await startBotEngine();
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
}

startServer();
