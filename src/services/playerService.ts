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
};
