CREATE TABLE `material_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_types_slug_unique` ON `material_types` (`slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_materials` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`type_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`min_stock` integer DEFAULT 1000 NOT NULL,
	`in_stock` integer DEFAULT false NOT NULL,
	`price_per_cm2` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `material_categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`type_id`) REFERENCES `material_types`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_materials`("id", "category_id", "type_id", "name", "description", "image_url", "stock", "min_stock", "in_stock", "price_per_cm2") SELECT "id", "category_id", "type_id", "name", "description", "image_url", "stock", "min_stock", "in_stock", "price_per_cm2" FROM `materials`;--> statement-breakpoint
DROP TABLE `materials`;--> statement-breakpoint
ALTER TABLE `__new_materials` RENAME TO `materials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;