CREATE TYPE "public"."connection_status" AS ENUM('blocked', 'friend', 'bot');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('chat', 'mail');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"size" integer DEFAULT 0 NOT NULL,
	"is_decoy" boolean DEFAULT false NOT NULL,
	"is_trap" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" integer NOT NULL,
	"target_ip" varchar(45) NOT NULL,
	"status" "connection_status" DEFAULT 'friend' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "defenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" integer NOT NULL,
	"firewall_level" integer DEFAULT 1 NOT NULL,
	"ids_status" boolean DEFAULT false NOT NULL,
	"honeypot_active" boolean DEFAULT false NOT NULL,
	"lockdown_active" boolean DEFAULT false NOT NULL,
	"autopay_threshold" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "defenses_system_id_unique" UNIQUE("system_id")
);
--> statement-breakpoint
CREATE TABLE "networks" (
	"id" serial PRIMARY KEY NOT NULL,
	"system_id" integer NOT NULL,
	"port" integer NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "systems" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"ip" varchar(45) NOT NULL,
	"hostname" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"mail" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "systems_ip_unique" UNIQUE("ip"),
	CONSTRAINT "systems_mail_unique" UNIQUE("mail")
);
--> statement-breakpoint
ALTER TABLE "abilities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "player_abilities" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "abilities" CASCADE;--> statement-breakpoint
DROP TABLE "player_abilities" CASCADE;--> statement-breakpoint
ALTER TABLE "chat_logs" DROP CONSTRAINT "chat_logs_sender_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_logs" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "chat_logs" ALTER COLUMN "tags" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "chat_logs" ADD COLUMN "receiver_id" integer;--> statement-breakpoint
ALTER TABLE "chat_logs" ADD COLUMN "type" "message_type" DEFAULT 'chat' NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "defenses" ADD CONSTRAINT "defenses_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "networks" ADD CONSTRAINT "networks_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems" ADD CONSTRAINT "systems_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_receiver_id_players_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_logs" ADD CONSTRAINT "chat_logs_sender_id_players_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;