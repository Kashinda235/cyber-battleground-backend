import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { index, primaryKey, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'moderator', 'red', 'blue', 'spectator', 'bot']);
export const userStatus = pgEnum('user_status', ['online', 'offline', 'banned']);

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 32 }).notNull(),
  role: userRole('role').default('spectator').notNull(),
  status: userStatus('status').default('offline').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeen: timestamp('last_seen', { withTimezone: true }).defaultNow().notNull(),
});

export const abilities = pgTable('abilities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 48 }).notNull(),
  stats: jsonb('stats').notNull(),
});

export const playerAbilities = pgTable('player_abilities', {
  playerId: integer('player_id').notNull().references(() => players.id),
  abilityId: integer('ability_id').notNull().references(() => abilities.id),
  cooldownUntil: timestamp('cooldown_until', { withTimezone: true }).notNull(),
}, table => ({
  pk: primaryKey(table.playerId, table.abilityId),
}));

export const moveLogs = pgTable('move_logs', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').notNull().references(() => players.id),
  targetId: integer('target_id').notNull().references(() => players.id),
  action: text('action').notNull(),
  metadata: jsonb('metadata').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
}, table => ({
  playerTimestampIndex: index('move_logs_player_id_timestamp_idx')
      .on(table.playerId, table.timestamp.desc()),
}));

export const globalState = pgTable('global_state', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
});

export const chatLogs = pgTable('chat_logs', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => players.id),
  message: text('message').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  metadata: jsonb('metadata').notNull(),
  tags: jsonb('tags').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, table => ({
  timestampIndex: index('chat_logs_timestamp_idx')
      .on(table.timestamp.desc()),
}));

export type Player = InferSelectModel<typeof players>;
export type NewPlayer = InferInsertModel<typeof players>;

export type Ability = InferSelectModel<typeof abilities>;
export type NewAbility = InferInsertModel<typeof abilities>;

export type PlayerAbility = InferSelectModel<typeof playerAbilities>;
export type NewPlayerAbility = InferInsertModel<typeof playerAbilities>;

export type MoveLog = InferSelectModel<typeof moveLogs>;
export type NewMoveLog = InferInsertModel<typeof moveLogs>;

export type GlobalState = InferSelectModel<typeof globalState>;
export type NewGlobalState = InferInsertModel<typeof globalState>;

export type ChatLog = InferSelectModel<typeof chatLogs>;
export type NewChatLog = InferInsertModel<typeof chatLogs>;
