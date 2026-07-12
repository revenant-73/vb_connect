DROP INDEX "event_date_idx";--> statement-breakpoint
DROP INDEX "groups_slug_unique";--> statement-breakpoint
DROP INDEX "event_user_idx";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "is_approved" TO "is_approved" integer NOT NULL DEFAULT true;--> statement-breakpoint
CREATE INDEX `event_date_idx` ON `events` (`event_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `groups_slug_unique` ON `groups` (`slug`);--> statement-breakpoint
CREATE INDEX `event_user_idx` ON `rsvps` (`event_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `events` ADD `city` text DEFAULT 'Portland' NOT NULL;