ALTER TABLE "spot" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "spot" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "spot" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "bust_level" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "location" "geography";--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "created_at" text DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "updated_at" text DEFAULT now() NOT NULL;