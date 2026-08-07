import { and, eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { players } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';

export const playerService = {
  async getMe(playerId: number) {
    const [player] = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    return player;
  },

  async updateStatus(playerId: number, status: string) {
    const [player] = await db.update(players).set({ status: status as any, lastSeen: new Date() }).where(eq(players.id, playerId)).returning();
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    return player;
  },

  async listPlayers() {
    return db.select().from(players);
  },

  async deleteAllPlayers() {
    return db.transaction(async (tx) => {
      await tx.delete(players);
      return { success: true, message: 'All players deleted' };
    });
  },

  async deletePlayer(playerId: number) {
    return db.transaction(async (tx) => {
      const [player] = await tx.select().from(players).where(eq(players.id, playerId)).limit(1);
      if (!player) {
        throw new AppError('Player not found', 404);
      }

      await tx.delete(players).where(eq(players.id, playerId));
      return { success: true, message: 'Player deleted' };
    });
  },

};
