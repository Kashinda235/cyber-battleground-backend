// botServer.ts
import { botController } from "./botController.js";
import { botUtils } from "./utils.js";

export async function startBotEngine() {
    const bots = await botController.listBots();
    await botController.pongBots();

    if (bots.length === 0) {
        console.log("[BOTS] No bots registered in database.");
        return;
    }
    console.log(`[BOTS] Loaded ${bots.length} active bot(s).`);

    setInterval(async () => {
        const activePlayerIds = await botController.getOnlinePlayerIds();

        const targets = activePlayerIds.length > 0 ? activePlayerIds : [1];

        for (const bot of bots) {
            await botController.createAction(bot.id, botUtils.getRandomAction(targets));
            botUtils.delay(1000);
        }
    }, 5000);

    setInterval(async () => {
        for (const bot of bots) {
            await botController.sendChat(bot.id, botUtils.getRandomChat());
            botUtils.delay(1000);
        }
    }, 5000);

    setInterval(async () => {
        const activePlayerIds = await botController.getOnlinePlayerIds();

        const targets = activePlayerIds.length > 0 ? activePlayerIds : [1];

        for (const bot of bots) {
            await botController.sendMail(bot.id, botUtils.getRandomMail(targets));
            botUtils.delay(10000);
        }
    }, 2 * 60 * 1000);
}

startBotEngine().catch(console.error);