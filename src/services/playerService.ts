import { and, eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { abilities, playerAbilities, players } from '../db/schema.js';
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

  async listAbilities() {
    return db.select().from(abilities);
  },

  async createAbility(input: { name: string; description: string; type: string; stats: Record<string, unknown> }) {
    const [ability] = await db.insert(abilities).values({
      name: input.name,
      description: input.description,
      type: input.type,
      stats: input.stats,
    }).returning();

    return ability;
  },

  async updateAbility(id: number, input: { name?: string; description?: string; type?: string; stats?: Record<string, unknown> }) {
    const [existing] = await db.select().from(abilities).where(eq(abilities.id, id)).limit(1);
    if (!existing) {
      throw new AppError('Ability not found', 404);
    }

    const [ability] = await db.update(abilities)
      .set({
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        type: input.type ?? existing.type,
        stats: input.stats ?? existing.stats,
      })
      .where(eq(abilities.id, id))
      .returning();

    return ability;
  },

  async getAbilityById(id: number) {
    const [ability] = await db.select().from(abilities).where(eq(abilities.id, id)).limit(1);
    if (!ability) {
      throw new AppError('Ability not found', 404);
    }
    return ability;
  },

  async assignAbility(playerId: number, abilityId: number) {
    const [player] = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    const [ability] = await db.select().from(abilities).where(eq(abilities.id, abilityId)).limit(1);
    if (!ability) {
      throw new AppError('Ability not found', 404);
    }

    const cooldownUntil = new Date(Date.now() + 60_000);
    const [assigned] = await db.insert(playerAbilities).values({
      playerId,
      abilityId,
      cooldownUntil,
    }).onConflictDoNothing().returning();

    if (!assigned) {
      throw new AppError('Ability already assigned', 409);
    }

    return assigned;
  },

  async getPlayerAbilities(playerId: number) {
    return db.select().from(playerAbilities).where(eq(playerAbilities.playerId, playerId));
  },

  async deleteAllPlayers() {
    return db.transaction(async (tx) => {
      await tx.delete(playerAbilities);
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

      await tx.delete(playerAbilities).where(eq(playerAbilities.playerId, playerId));
      await tx.delete(players).where(eq(players.id, playerId));
      return { success: true, message: 'Player deleted' };
    });
  },

  async deleteAllAbilities() {
    return db.transaction(async (tx) => {
      await tx.delete(playerAbilities);
      await tx.delete(abilities);
      return { success: true, message: 'All abilities deleted' };
    });
  },

  async deleteAbility(abilityId: number) {
    return db.transaction(async (tx) => {
      const [ability] = await tx.select().from(abilities).where(eq(abilities.id, abilityId)).limit(1);
      if (!ability) {
        throw new AppError('Ability not found', 404);
      }

      await tx.delete(playerAbilities).where(eq(playerAbilities.abilityId, abilityId));
      await tx.delete(abilities).where(eq(abilities.id, abilityId));
      return { success: true, message: 'Ability deleted' };
    });
  },

  async deleteAllPlayerAbilities(playerId: number) {
    return db.transaction(async (tx) => {
      const [player] = await tx.select().from(players).where(eq(players.id, playerId)).limit(1);
      if (!player) {
        throw new AppError('Player not found', 404);
      }

      await tx.delete(playerAbilities).where(eq(playerAbilities.playerId, playerId));
      return { success: true, message: 'Player abilities deleted' };
    });
  },

  async deletePlayerAbility(playerId: number, abilityId: number) {
    return db.transaction(async (tx) => {
      const [player] = await tx.select().from(players).where(eq(players.id, playerId)).limit(1);
      if (!player) {
        throw new AppError('Player not found', 404);
      }

      const [assignment] = await tx.select().from(playerAbilities)
        .where(and(eq(playerAbilities.playerId, playerId), eq(playerAbilities.abilityId, abilityId)))
        .limit(1);
      if (!assignment) {
        throw new AppError('Player ability not found', 404);
      }

      await tx.delete(playerAbilities).where(and(eq(playerAbilities.playerId, playerId), eq(playerAbilities.abilityId, abilityId)));
      return { success: true, message: 'Player ability deleted' };
    });
  },
};
