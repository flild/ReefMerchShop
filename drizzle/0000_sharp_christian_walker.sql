CREATE TABLE `accessories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`min_stock` integer DEFAULT 50 NOT NULL,
	`price` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`cover_image` text,
	`content_md` text DEFAULT '' NOT NULL,
	`views_count` integer DEFAULT 0 NOT NULL,
	`reads_count` integer DEFAULT 0 NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`dislikes_count` integer DEFAULT 0 NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `blanks` (
	`id` text PRIMARY KEY NOT NULL,
	`material_id` text,
	`name` text NOT NULL,
	`size` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`min_stock` integer DEFAULT 50 NOT NULL,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `checklist_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`product_type` text NOT NULL,
	`parameter` text NOT NULL,
	`expected_value` text NOT NULL,
	`warning_message` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collect_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`collect_id` text NOT NULL,
	`user_id` text,
	`email` text NOT NULL,
	`telegram` text,
	`layout_name` text,
	`layout_link` text,
	`nickname` text NOT NULL,
	`vk_id` text,
	`quantity` integer DEFAULT 0 NOT NULL,
	`total_price` integer DEFAULT 0 NOT NULL,
	`file_id` text,
	`is_layouts_uploaded` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`collect_id`) REFERENCES `collects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`deadline` integer NOT NULL,
	`production_date` text NOT NULL,
	`min_count` integer NOT NULL,
	`current_count` integer DEFAULT 0 NOT NULL,
	`current_sum` integer DEFAULT 0 NOT NULL,
	`target_sum_limit` integer DEFAULT 250000 NOT NULL,
	`max_discount` integer DEFAULT 20 NOT NULL,
	`drive_link` text,
	`status` text DEFAULT 'open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`mime_type` text,
	`size` integer,
	`owner_id` text,
	`created_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `material_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_categories_slug_unique` ON `material_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `materials` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`min_stock` integer DEFAULT 1000 NOT NULL,
	`in_stock` integer DEFAULT false NOT NULL,
	`price_per_cm2` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `material_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`name` text,
	`product_type` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`material_id` text,
	`accessory_id` text,
	`area_cm2` real,
	`price` integer NOT NULL,
	`file_id` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`accessory_id`) REFERENCES `accessories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `order_proofs` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`order_item_id` text,
	`file_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`manager_comment` text,
	`client_comment` text,
	`created_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`status` text NOT NULL,
	`comment` text,
	`created_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_number` text NOT NULL,
	`user_id` text,
	`status` text DEFAULT 'new' NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`details_json` text DEFAULT '{}' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text,
	`title` text NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`author_name` text,
	`created_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`size` text,
	`product_type` text,
	`formats_json` text NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'client' NOT NULL,
	`telegram_id` text,
	`vk_id` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);