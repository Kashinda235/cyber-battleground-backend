import {and, eq, ExtractTablesWithRelations} from 'drizzle-orm';
import { db } from '../db/db.js';
import { assets, connections, defenses, networks, players, systems } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';
import {PgQueryResultHKT, PgTransaction} from "drizzle-orm/pg-core";
import {NodePgDatabase} from "drizzle-orm/node-postgres";

const DEFAULT_NETWORK_PORTS = [22, 80, 443];
export type DbOrTx =
    | NodePgDatabase<Record<string, never>>
    | PgTransaction<PgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>;

export const systemService = {
  async createPlayerSystem(playerId: number, username: string, extractor: DbOrTx = db) {
    const [existingSystem] = await extractor.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (existingSystem) {
      throw new AppError('System already exists for player', 409);
    }

    const ip = `192.168.${Math.floor(playerId / 254 + 2)}.${Math.max(1, playerId % 254)}`;
    const [system] = await extractor.insert(systems).values({
      playerId,
      ip,
      hostname: `${username}-machine`,
      password: 'changeme',
      mail: `${username}@cyber.org`,
    }).returning();

    const networkRows = DEFAULT_NETWORK_PORTS.map((port) => ({
      systemId: system.id,
      port,
      status: 'open',
      metadata: {},
    }));
    await extractor.insert(networks).values(networkRows);

    await extractor.insert(defenses).values({
      systemId: system.id,
      firewallLevel: 1,
      idsStatus: false,
      honeypotActive: false,
      lockdownActive: false,
      autoPayThreshold: 0,
    });

    return system;
  },

  async getSystemForPlayer(playerId: number) {
    const [player] = await db.select().from(players).where(eq(players.id, playerId)).limit(1);
    if (!player) {
      throw new AppError('Player not found', 404);
    }

    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [defense] = await db.select().from(defenses).where(eq(defenses.systemId, system.id)).limit(1);
    const networkConfigs = await db.select().from(networks).where(eq(networks.systemId, system.id));

    return { player, system, defense, network: networkConfigs };
  },

  async listSystems() {
    return db.select().from(systems);
  },

  async updateSystem(playerId: number, data: { hostname?: string; password?: string; mail?: string }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [updated] = await db.update(systems)
      .set({
        hostname: data.hostname ?? system.hostname,
        password: data.password ?? system.password,
        mail: data.mail ?? system.mail,
      })
      .where(eq(systems.id, system.id))
      .returning();

    return updated;
  },

  async getNetworkConfigs(playerId: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }
    return db.select().from(networks).where(eq(networks.systemId, system.id));
  },

  async updateNetworkConfig(playerId: number, id: number, data: { port?: number; metadata?: Record<string, unknown>; status?: string }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [networkRow] = await db.select().from(networks).where(and(eq(networks.id, id), eq(networks.systemId, system.id))).limit(1);
    if (!networkRow) {
      throw new AppError('Network port not found', 404);
    }

    const [updated] = await db.update(networks)
      .set({
        port: data.port ?? networkRow.port,
        metadata: data.metadata ?? networkRow.metadata,
        status: data.status ?? networkRow.status,
      })
      .where(eq(networks.id, id))
      .returning();

    return updated;
  },

  async getDefense(playerId: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }
    const [defense] = await db.select().from(defenses).where(eq(defenses.systemId, system.id)).limit(1);
    if (!defense) {
      throw new AppError('Defense settings not found', 404);
    }
    return defense;
  },

  async updateDefense(playerId: number, data: { firewall_level?: number; ids_status?: boolean; honeypot_active?: boolean; lockdown_active?: boolean; autopay_threshold?: number }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [defense] = await db.select().from(defenses).where(eq(defenses.systemId, system.id)).limit(1);
    if (!defense) {
      throw new AppError('Defense settings not found', 404);
    }

    const [updated] = await db.update(defenses)
      .set({
        firewallLevel: data.firewall_level ?? defense.firewallLevel,
        idsStatus: data.ids_status ?? defense.idsStatus,
        honeypotActive: data.honeypot_active ?? defense.honeypotActive,
        lockdownActive: data.lockdown_active ?? defense.lockdownActive,
        autoPayThreshold: data.autopay_threshold ?? defense.autoPayThreshold,
      })
      .where(eq(defenses.id, defense.id))
      .returning();

    return updated;
  },

  async listAssets(playerId: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }
    return db.select().from(assets).where(eq(assets.systemId, system.id));
  },

  async createAsset(playerId: number, data: { name: string; value?: number; size?: number; is_decoy?: boolean; is_trap?: boolean }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [asset] = await db.insert(assets).values({
      systemId: system.id,
      name: data.name,
      value: data.value ?? 0,
      size: data.size ?? 0,
      isDecoy: data.is_decoy ?? false,
      isTrap: data.is_trap ?? false,
    }).returning();

    return asset;
  },

  async updateAsset(playerId: number, id: number, data: { name?: string; value?: number; size?: number; is_decoy?: boolean; is_trap?: boolean }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [asset] = await db.select().from(assets).where(and(eq(assets.id, id), eq(assets.systemId, system.id))).limit(1);
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }

    const [updated] = await db.update(assets)
      .set({
        name: data.name ?? asset.name,
        value: data.value ?? asset.value,
        size: data.size ?? asset.size,
        isDecoy: data.is_decoy ?? asset.isDecoy,
        isTrap: data.is_trap ?? asset.isTrap,
      })
      .where(eq(assets.id, id))
      .returning();

    return updated;
  },

  async deleteAsset(playerId: number, id: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [asset] = await db.select().from(assets).where(and(eq(assets.id, id), eq(assets.systemId, system.id))).limit(1);
    if (!asset) {
      throw new AppError('Asset not found', 404);
    }

    await db.delete(assets).where(eq(assets.id, id));
    return { success: true, message: 'Asset deleted' };
  },

  async listConnections(playerId: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }
    return db.select().from(connections).where(eq(connections.systemId, system.id));
  },

  async createConnection(playerId: number, data: { target_ip: string; status: string }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [connectionRow] = await db.insert(connections).values({
      systemId: system.id,
      targetIp: data.target_ip,
      status: data.status as any,
    }).returning();

    return connectionRow;
  },

  async updateConnection(playerId: number, id: number, data: { status: string }) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [connectionRow] = await db.select().from(connections).where(and(eq(connections.id, id), eq(connections.systemId, system.id))).limit(1);
    if (!connectionRow) {
      throw new AppError('Connection not found', 404);
    }

    const [updated] = await db.update(connections)
      .set({ status: data.status as any })
      .where(eq(connections.id, id))
      .returning();

    return updated;
  },

  async deleteConnection(playerId: number, id: number) {
    const [system] = await db.select().from(systems).where(eq(systems.playerId, playerId)).limit(1);
    if (!system) {
      throw new AppError('System not found', 404);
    }

    const [connectionRow] = await db.select().from(connections).where(and(eq(connections.id, id), eq(connections.systemId, system.id))).limit(1);
    if (!connectionRow) {
      throw new AppError('Connection not found', 404);
    }

    await db.delete(connections).where(eq(connections.id, id));
    return { success: true, message: 'Connection deleted' };
  },
};
