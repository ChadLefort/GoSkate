ALTER TABLE "spots" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "spots_to_labels" DROP CONSTRAINT "spots_to_labels_spot_id_spots_id_fk";
--> statement-breakpoint
ALTER TABLE "spot_images" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "spot_images" ALTER COLUMN "url" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "spot_labels" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "slug" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "address" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "address_line_2" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "city" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "state" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "zip" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spots_to_labels" ADD CONSTRAINT "spots_to_labels_spot_id_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
