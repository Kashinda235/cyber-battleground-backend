import {gameService} from "../services/gameService.js";
import {app} from "../app.js";
import {mailService} from "../services/mailService.js";
import {db} from "../db/db.js";
import {players} from "../db/schema.js";
import {eq, ne, and} from "drizzle-orm";
import type {Action, Mail} from "./utils.js"

export const botController = {
    async sendChat(botId: number, message: string) {
        const result = await gameService.postChat(botId, message);
        if (app.locals.broadcastMessage) {
            app.locals.broadcastMessage(result);
        }
    },

    async createAction(botId: number, data: Action) {
        const result = await gameService.performAction(botId, data);
        if (app.locals.broadcastPerformedAction) {
            app.locals.broadcastPerformedAction(result.moveLog);
        }
    },

    async sendMail(botId: number, data: Mail) {
        const result = await mailService.sendMail(botId, data);
        if (app.locals.broadcastSendMail) {
            app.locals.broadcastSendMail(result.receiverId, result);
        }
    },

    async listBots () {
        return db.select().from(players).where(eq(players.role, "bot"));
    },

    async pongBots () {
        await db.update(players).set({ status: 'online' }).where(eq(players.role, "bot"));
    },

    async getOnlinePlayerIds(): Promise<number[]> {
        const onlinePlayers = await db
            .select({ id: players.id }).from(players)
            .where(
                and(
                    eq(players.status, "online"),
                    ne(players.role, "bot")
                )
            );
        return onlinePlayers.map((player) => player.id);
    },
}
