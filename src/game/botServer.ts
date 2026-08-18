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

    async function runActionLoop() {
        try {
            const targets = await botController.getOnlinePlayerIds();
            if (targets.length > 0) {
                for (const bot of bots) {
                    try {
                        await botController.createAction(bot.id, botUtils.getRandomAction(targets));
                    } catch (error) {
                        console.error('[BOT ERROR] Action failed:', error);
                    }
                    await botUtils.delay(3000);
                }
            }
        } catch (error) {
            console.error('[BOT ERROR] Action loop error:', error);
        } finally {
            // Wait 5s AFTER the current loop finishes before queuing the next one
            setTimeout(runActionLoop, 20000);
        }
    }

    async function runChatLoop() {
        try {
            for (const bot of bots) {
                try {
                    await botController.sendChat(bot.id, botUtils.getRandomChat());
                } catch (error) {
                    console.error('[BOT ERROR] Chat failed:', error);
                }
                await botUtils.delay(2000); // 👈 FIXED: Added 'await'
            }
        } catch (error) {
            console.error('[BOT ERROR] Chat loop error:', error);
        } finally {
            setTimeout(runChatLoop, 10000);
        }
    }

    async function runMailLoop() {
        try {
            const targets = await botController.getOnlinePlayerIds();
            if (targets.length > 0 && bots.length > 0) {
                await botController.sendMail(bots[0].id, botUtils.getRandomMail(targets));
            }
        } catch (error) {
            console.error('[BOT ERROR] Mail loop error:', error);
        } finally {
            setTimeout(runMailLoop, 2 * 60 * 1000);
        }
    }

    runActionLoop();
    runChatLoop();
    runMailLoop();
}

startBotEngine().catch(console.error);