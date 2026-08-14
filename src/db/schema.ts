import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { index, primaryKey, boolean, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'moderator', 'red', 'blue', 'spectator', 'bot']);
export const userStatus = pgEnum('user_status', ['online', 'offline', 'banned']);
export const connectionStatusEnum = pgEnum('connection_status', ['blocked', 'friend', 'bot']);

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 32 }).notNull(),
  role: userRole('role').default('spectator').notNull(),
  status: userStatus('status').default('offline').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  lastSeen: timestamp('last_seen', { withTimezone: true }).defaultNow().notNull(),
});

export const moveLogs = pgTable('move_logs', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  targetId: integer('target_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
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

export const mails = pgTable('mails', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  receiverId: integer('receiver_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  isSeen: boolean('is_seen').default(false).notNull(),
  phishingPayload: boolean('phishing_payload').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  timestamp: timestamp('time_stamp', { withTimezone: true }).notNull(),
}, table => ({
  timestampIndex: index('mails_timestamp_idx')
      .on(table.timestamp.desc()),
}));

export const systems = pgTable('systems', {
  id: serial('id').primaryKey(),
  playerId: integer('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  ip: varchar('ip', { length: 45 }).notNull().unique(), // IPv4/IPv6 length
  hostname: varchar('hostname', { length: 255 }).notNull(),
  password: text('password').notNull(),
  mail: varchar('mail', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const networks = pgTable('networks', {
  id: serial('id').primaryKey(),
  systemId: integer('system_id').notNull().references(() => systems.id, { onDelete: 'cascade' }),
  port: integer('port').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'), // e.g., open, closed, filtered
  metadata: jsonb('metadata').default({}).notNull(),
});

export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  systemId: integer('system_id').notNull().references(() => systems.id, { onDelete: 'cascade' }),
  targetIp: varchar('target_ip', { length: 45 }).notNull(),
  status: connectionStatusEnum('status').notNull().default('friend'),
});

export const defenses = pgTable('defenses', {
  id: serial('id').primaryKey(),
  systemId: integer('system_id').notNull().unique().references(() => systems.id, { onDelete: 'cascade' }),
  firewallLevel: integer('firewall_level').default(1).notNull(),
  idsStatus: boolean('ids_status').default(false).notNull(),
  honeypotActive: boolean('honeypot_active').default(false).notNull(),
  lockdownActive: boolean('lockdown_active').default(false).notNull(),
  autoPayThreshold: integer('autopay_threshold').default(0).notNull(),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  systemId: integer('system_id').notNull().references(() => systems.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  value: integer('value').default(0).notNull(),
  size: integer('size').default(0).notNull(), // size in MB/GB/KB
  isDecoy: boolean('is_decoy').default(false).notNull(),
  isTrap: boolean('is_trap').default(false).notNull(),
});

export type Player = InferSelectModel<typeof players>;
export type NewPlayer = InferInsertModel<typeof players>;

export type MoveLog = InferSelectModel<typeof moveLogs>;
export type NewMoveLog = InferInsertModel<typeof moveLogs>;

export type GlobalState = InferSelectModel<typeof globalState>;
export type NewGlobalState = InferInsertModel<typeof globalState>;

export type ChatLog = InferSelectModel<typeof chatLogs>;
export type NewChatLog = InferInsertModel<typeof chatLogs>;

export type System = InferSelectModel<typeof systems>;
export type NewSystem = InferInsertModel<typeof systems>;

export type Network = InferSelectModel<typeof networks>;
export type NewNetwork = InferInsertModel<typeof networks>;

export type Connection = InferSelectModel<typeof connections>;
export type NewConnection = InferInsertModel<typeof connections>;

export type Defense = InferSelectModel<typeof defenses>;
export type NewDefense = InferInsertModel<typeof defenses>;

export type Asset = InferSelectModel<typeof assets>;
export type NewAsset = InferInsertModel<typeof assets>;