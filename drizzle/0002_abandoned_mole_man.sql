CREATE TABLE "mails" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender" varchar(255) NOT NULL,
	"receiver_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_seen" boolean DEFAULT false NOT NULL,
	"phishing_payload" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_logs" DROP CONSTRAINT "chat_logs_receiver_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_logs" DROP CONSTRAINT "chat_logs_sender_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "move_logs" DROP CONSTRAINT "move_logs_player_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "move_logs" DROP CONSTRAINT "move_logs_target_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_logs" ALTER COLUMN "metadata" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "chat_logs" ALTER COLUMN "tags" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "mails" ADD CONSTRAINT "mails_receiver_id_players_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mails_timestamp_idx" ON "mails" USING btree ("timestamp" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_sender_id_players_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_logs" ADD CONSTRAINT "move_logs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_logs" ADD CONSTRAINT "move_logs_target_id_players_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_logs" DROP COLUMN "receiver_id";--> statement-breakpoint
ALTER TABLE "chat_logs" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."message_type";