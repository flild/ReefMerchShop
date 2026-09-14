CREATE TABLE `checklist_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`is_required` integer DEFAULT false NOT NULL,
	`options_json` text DEFAULT '[]' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`template_id`) REFERENCES `checklist_templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `checklist_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image_url` text,
	`created_at` integer,
	`updated_at` integer
);
