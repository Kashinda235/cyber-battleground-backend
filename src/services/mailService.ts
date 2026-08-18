import { and, eq, desc } from 'drizzle-orm';
import { db } from '../db/db.js';
import { mails, players } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';

export const mailService = {
  async getInbox(playerId: number) {
    return db.select().from(mails).where(eq(mails.receiverId, playerId)).orderBy(desc(mails.timestamp));
  },

  async getSent(playerId: number) {
    return db.select().from(mails).where(eq(mails.senderId, playerId)).orderBy(desc(mails.timestamp));
  },

  async sendMail(senderId: number, input: { receiverId: number; message: string; phishingPayload?: boolean;}) {
    const [sender] = await db.select().from(players).where(eq(players.id, senderId)).limit(1);
    const [receiver] = await db.select().from(players).where(eq(players.id, input.receiverId)).limit(1);
    if (!receiver) {
      throw new AppError('Receiver not found', 404);
    }

    const [mail] = await db.insert(mails).values({
      senderId,
      receiverId: input.receiverId,
      message: input.message,
      isSeen: false,
      phishingPayload: input.phishingPayload ?? false,
      metadata: {
        reward: 10000, sender: `${sender.username.toLowerCase()}@cyber.org`
      },
      timestamp: new Date(),
      createdAt: new Date(),
    }).returning();

    return mail;
  },

  async updateSeen(playerId: number, id: number, isSeen: boolean) {
    const [mail] = await db.select().from(mails).where(eq(mails.id, id)).limit(1);
    if (!mail) {
      throw new AppError('Mail not found', 404);
    }
    if (mail.receiverId !== playerId) {
      throw new AppError('Only receiver can update seen status', 403);
    }

    const [updated] = await db.update(mails).set({ isSeen: isSeen }).where(eq(mails.id, id)).returning();
    return updated;
  },

  async deleteMail(playerId: number, id: number) {
    const [mail] = await db.select().from(mails).where(eq(mails.id, id)).limit(1);
    if (!mail) {
      throw new AppError('Mail not found', 404);
    }
    if (mail.receiverId !== playerId && mail.senderId !== playerId) {
      throw new AppError('Not authorized to delete this mail', 403);
    }

    await db.delete(mails).where(eq(mails.id, id));
    return { success: true, message: 'Mail deleted' };
  },
};
