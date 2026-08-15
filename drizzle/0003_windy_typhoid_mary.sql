ALTER TABLE "mails" RENAME COLUMN "timestamp" TO "time_stamp";--> statement-breakpoint
DROP INDEX "mails_timestamp_idx";--> statement-breakpoint
ALTER TABLE "mails" ADD COLUMN "sender_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "xp" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "systems" ADD COLUMN "health" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "mails" ADD CONSTRAINT "mails_sender_id_players_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mails_timestamp_idx" ON "mails" USING btree ("time_stamp" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "mails" DROP COLUMN "sender";--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "xp_check" CHECK ("players"."xp" >= 0);--> statement-breakpoint
ALTER TABLE "systems" ADD CONSTRAINT "health_check" CHECK ("systems"."health" >= 0);