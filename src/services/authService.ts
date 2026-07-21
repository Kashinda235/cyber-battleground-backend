import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { players } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authService = {
  async register(username: string, role: string) {
    const existing = await db.select().from(players).where(eq(players.username, username)).limit(1);
    if (existing.length > 0) {
      throw new AppError('Player already exists', 409);
    }

    const [player] = await db.insert(players).values({
      username,
      role: role as any,
      status: 'online' as any,
    }).returning();

    const token = jwt.sign({ playerId: player.id, username: player.username, role: player.role }, JWT_SECRET);
    return { token, player };
  },

  async login(username: string) {
    const [player] = await db.select().from(players).where(eq(players.username, username)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    await db.update(players).set({ status: 'online' as any, lastSeen: new Date() }).where(eq(players.id, player.id));

    const token = jwt.sign({ playerId: player.id, username: player.username, role: player.role }, JWT_SECRET);
    return { token, player };
  },
};
