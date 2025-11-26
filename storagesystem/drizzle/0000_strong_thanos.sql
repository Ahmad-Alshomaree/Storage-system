CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_name` text NOT NULL,
	`product_type` text NOT NULL,
	`original_price` real NOT NULL,
	`selling_price` real NOT NULL,
	`storage` text NOT NULL,
	`quantity` integer,
	`weight` real,
	`sizes` real,
	`colors` text,
	`image` text,
	`box_number` real NOT NULL,
	`price_per_box` integer NOT NULL,
	`shipping_id` integer,
	`total_original_price` real NOT NULL,
	`size_of_box_at_ship` real NOT NULL,
	`total_box_size` real NOT NULL,
	`box_code` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipping` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`shipping_date` text NOT NULL,
	`receiver` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_product_name` ON `products` (`product_name`);--> statement-breakpoint
CREATE INDEX `idx_product_type` ON `products` (`product_type`);--> statement-breakpoint
CREATE INDEX `idx_box_code` ON `products` (`box_code`);--> statement-breakpoint
CREATE INDEX `idx_shipping_id` ON `products` (`shipping_id`);--> statement-breakpoint
CREATE INDEX `idx_shipping_type` ON `shipping` (`type`);