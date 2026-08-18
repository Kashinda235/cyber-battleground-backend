import { WebSocket, WebSocketServer } from 'ws';
import type { Server, IncomingMessage } from 'http';
import {db} from "../db/db.js";
import {players} from "../db/schema.js";
import {eq} from "drizzle-orm";

export interface Player {
    id: number;
    username: string;
    role: "admin" | "moderator" | "red" | "blue" | "spectator" | "bot";
    status: "online" | "offline" | "banned";
    joinedAt: Date;
    lastSeen: Date;
}
// Extend the WebSocket interface to declare custom properties
export interface CustomWebSocket extends WebSocket {
    isAlive?: boolean;
    player?: Player,
}

// Helper to safely send JSON payloads
function sendJson(socket: CustomWebSocket, payload: unknown): void {
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

// Helper to broadcast JSON to all clients
function broadcast(wss: WebSocketServer, payload: unknown): void {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;

        client.send(JSON.stringify(payload));
    }
}

// Exported server attachment function
export function attachWebSocketServer(server: Server) {
    const wss = new WebSocketServer({
        server, path: '/ws', maxPayload: 1024 * 1024
    });

    // Keep track of online players
    const onlinePlayers = new Map<string, Player>();

    wss.on('connection', async (socket: CustomWebSocket, req: IncomingMessage) => {
        socket.isAlive = true;

        // Optional: Parse query params if client connects like: ws://localhost:8000/ws?playerId=123&name=Alex
        const urlParams = new URLSearchParams(req.url?.split('?')[1]);
        const playerId = urlParams.get('playerId');
        console.log(onlinePlayers);

        if (playerId) {
            try {
                const [player] = await db.select().from(players).where(eq(players.id, Number(playerId))).limit(1);

                if (!player) {
                    socket.close(4004, "Player not connected to socket");
                    return;
                }

                const [updatedPlayer] = await db.update(players)
                    .set({ status: 'online' })
                    .where(eq(players.id, player.id))
                    .returning();

                socket.player = updatedPlayer ?? player;
                onlinePlayers.set(playerId, socket.player);

                broadcastPlayerJoined(socket.player);
            } catch (error) {
                console.error("Database error during player join:", error);
                socket.close(4000, "Internal server error");
            }
        }

        socket.on('pong', () => {
            socket.isAlive = true;
        });

        sendJson(socket, { type: 'welcome' });

        socket.on('error', console.error);

        socket.on('close', async () => {
            if (socket.player) {
                const playerIdStr = String(socket.player.id);
                onlinePlayers.delete(playerIdStr);

                try {
                    await db.update(players)
                        .set({ status: 'offline' })
                        .where(eq(players.id, socket.player.id));

                    broadcastPlayerLeft({ ...socket.player, status: 'offline' });

                    console.log(`[WS] Player left & DB updated: ${socket.player.username} (${socket.player.id})`);
                } catch (error) {
                    console.error(`[WS] Failed to set player ${socket.player.id} offline in DB:`, error);
                }
            }
        });
    });

    // Heartbeat check every 30s
    const interval = setInterval(() => {
        wss.clients.forEach((client) => {
            const ws = client as CustomWebSocket;

            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', () => clearInterval(interval));

    // --- Broadcast Functions ---
    function broadcastPlayerJoined<T = unknown>(player: T): void {
        broadcast(wss, { type: 'player_joined', data: player });
    }

    function broadcastPlayerLeft<T = unknown>(player: T): void {
        broadcast(wss, { type: 'player_left', data: player });
    }

    function broadcastPerformedAction<T = unknown>(action: T): void {
        broadcast(wss, { type: 'action', data: action });
    }

    function broadcastGameState<T = unknown>(state: T): void {
        broadcast(wss, { type: 'game_state', data: state });
    }

    function broadcastMessage<T = unknown>(message: T): void {
        broadcast(wss, { type: 'chat', data: message });
    }

    function broadcastSendMail<T = unknown>(targetId: number, mail: T): void {
        for (const client of wss.clients) {
            const ws = client as CustomWebSocket;
            if (ws.readyState === WebSocket.OPEN && ws.player?.id === Number(targetId)) {
                sendJson(ws, { type: 'mail', data: mail });
            }
        }
    }

    return {
        broadcastPlayerJoined,
        broadcastPlayerLeft,
        broadcastPerformedAction,
        broadcastGameState,
        broadcastMessage,
        broadcastSendMail,
    };
}