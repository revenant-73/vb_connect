ALTER TABLE `user` ADD `is_approved` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;