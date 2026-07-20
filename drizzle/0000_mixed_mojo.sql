CREATE TYPE "public"."user_role" AS ENUM('admin', 'moderator', 'red', 'blue', 'spectator', 'bot');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('online', 'offline', 'banned');--> statement-breakpoint
CREATE TABLE "abilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(48) NOT NULL,
	"stats" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"metadata" jsonb NOT NULL,
	"tags" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "global_state" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "move_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"target_id" integer NOT NULL,
	"action" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_abilities" (
	"player_id" integer NOT NULL,
	"ability_id" integer NOT NULL,
	"cooldown_until" timestamp with time zone NOT NULL,
	CONSTRAINT "player_abilities_player_id_ability_id_pk" PRIMARY KEY("player_id","ability_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"role" "user_role" DEFAULT 'spectator' NOT NULL,
	"status" "user_status" DEFAULT 'offline' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_sender_id_players_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_logs" ADD CONSTRAINT "move_logs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_logs" ADD CONSTRAINT "move_logs_target_id_players_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_abilities" ADD CONSTRAINT "player_abilities_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_abilities" ADD CONSTRAINT "player_abilities_ability_id_abilities_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."abilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_logs_timestamp_idx" ON "chat_logs" USING btree ("timestamp" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "move_logs_player_id_timestamp_idx" ON "move_logs" USING btree ("player_id","timestamp" DESC NULLS LAST);