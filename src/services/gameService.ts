import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.js';
import { abilities, chatLogs, globalState, moveLogs, playerAbilities, players } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';

const DEFAULT_STATE = {
  gameStatus: 'ready',
  turn: 1,
};

export const gameService = {
  async performAction(playerId: number, input: { actionType: string; targetId: number; abilityId: number }) {
    return db.transaction(async (tx) => {
      const [player] = await tx.select().from(players).where(eq(players.id, playerId)).limit(1);
      if (!player) {
        throw new AppError('Player not found', 404);
      }

      const [target] = await tx.select().from(players).where(eq(players.id, input.targetId)).limit(1);
      if (!target) {
        throw new AppError('Target not found', 404);
      }

      const [abilityAssignment] = await tx.select().from(playerAbilities).where(and(eq(playerAbilities.playerId, playerId), eq(playerAbilities.abilityId, input.abilityId))).limit(1);
      if (!abilityAssignment) {
        throw new AppError('Ability not assigned to player', 404);
      }

      const [ability] = await tx.select().from(abilities).where(eq(abilities.id, input.abilityId)).limit(1);
      if (!ability) {
        throw new AppError('Ability not found', 404);
      }

      const now = new Date();
      if (abilityAssignment.cooldownUntil > now) {
        throw new AppError('Ability is on cooldown', 409);
      }

      const power = (ability.stats as Record<string, unknown>)?.power ?? 0;
      const damage = 10 + Number(power);
      const cooldownUntil = new Date(now.getTime() + 30_000);

      await tx.update(playerAbilities)
        .set({ cooldownUntil })
        .where(and(eq(playerAbilities.playerId, playerId), eq(playerAbilities.abilityId, input.abilityId)));

      const [move] = await tx.insert(moveLogs).values({
        playerId,
        targetId: input.targetId,
        action: input.actionType,
        metadata: {
          abilityName: ability.name,
          damage,
          targetName: target.username,
        },
      }).returning();

      return {
        success: true,
        action: input.actionType,
        damage,
        cooldownRemaining: cooldownUntil.getTime() - now.getTime(),
        moveLog: move,
      };
    });
  },

  async getMoveLogs(playerId?: number, limit = 20) {
    const query = db.select().from(moveLogs)
      .orderBy(desc(moveLogs.timestamp));

    if (playerId) {
      return query.where(eq(moveLogs.playerId, playerId)).limit(limit);
    }

    return query.limit(limit);
  },

  async getState() {
    const [state] = await db.select().from(globalState);
    if (!state) {
      return DEFAULT_STATE;
    }
    return state.value as Record<string, unknown>;
  },

  async updateState(value: Record<string, unknown>) {
    const [state] = await db.insert(globalState).values({ key: 'game', value }).onConflictDoUpdate({
      target: globalState.key,
      set: { value },
    }).returning();

    return state.value as Record<string, unknown>;
  },

  async postChat(senderId: number, message: string) {
    const [player] = await db.select().from(players).where(eq(players.id, senderId)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    const [chatEntry] = await db.insert(chatLogs).values({
      senderId,
      message,
      timestamp: new Date(),
      metadata: { sender: player.username },
      tags: ['chat'],
    }).returning();

    return chatEntry;
  },

  async getChat(limit = 50) {
    return db.select().from(chatLogs).orderBy(desc(chatLogs.timestamp)).limit(limit);
  },

  async createSession(hostId: number) {
    const [host] = await db.select().from(players).where(eq(players.id, hostId)).limit(1);
    if (!host) {
      throw new AppError('Player not found', 404);
    }

    const sessionId = `session-${Date.now()}`;
    return { id: sessionId, hostId, players: [hostId] };
  },

  async joinSession(sessionId: string, playerId: number) {
    const [player] = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    return { id: sessionId, joined: true, playerId };
  },

  async getSession(sessionId: string) {
    return { id: sessionId, players: [] };
  },

  async getSessionPlayers(sessionId: string) {
    return { id: sessionId, players: [] };
  },
};
