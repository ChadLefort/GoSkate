ALTER TABLE "spot" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "address_line_2" text;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "spot" ADD COLUMN "zip" text NOT NULL;