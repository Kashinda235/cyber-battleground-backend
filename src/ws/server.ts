import { WebSocket, WebSocketServer } from 'ws';
import type { Server, IncomingMessage } from 'http';

export interface Player {
    id: string;
    name: string;
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

    wss.on('connection', (socket: CustomWebSocket, req: IncomingMessage) => {
        socket.isAlive = true;

        // Optional: Parse query params if client connects like: ws://localhost:8000/ws?playerId=123&name=Alex
        const urlParams = new URLSearchParams(req.url?.split('?')[1]);
        const playerId = urlParams.get('playerId');
        const playerName = urlParams.get('name');

        if (playerId && playerName) {
            const player: Player = { id: playerId, name: playerName };
            socket.player = player;
            onlinePlayers.set(playerId, player);

            broadcastPlayerJoined(player);
        }

        socket.on('pong', () => {
            socket.isAlive = true;
        });

        sendJson(socket, { type: 'welcome' });

        socket.on('error', console.error);

        socket.on('close', () => {
            if (socket.player) {
                // 1. Remove from active state
                onlinePlayers.delete(socket.player.id);

                // 2. Broadcast to everyone else that this player left!
                broadcastPlayerLeft(socket.player);

                console.log(`[WS] Player left: ${socket.player.name} (${socket.player.id})`);
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

    return {
        broadcastPlayerJoined,
        broadcastPlayerLeft,
        broadcastPerformedAction,
        broadcastGameState,
        broadcastMessage,
    };
}