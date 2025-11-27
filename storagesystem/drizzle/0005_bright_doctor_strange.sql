DROP TABLE products;
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shipping_id` integer REFERENCES shipping(id),
	`box_code` text NOT NULL,
	`product_name` text,
	`original_price` real NOT NULL,
	`total_original_price` real NOT NULL,
	`selling_price` real NOT NULL,
	`storage` text,
	`weight` real,
	`image` text,
	`pice_per_box` integer,
	`Total_pices` integer,
	`size_of_box` real NOT NULL,
	`total_box_size` real NOT NULL,
	`number_of_boxes` real NOT NULL,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_product_name` ON `products` (`product_name`);--> statement-breakpoint
CREATE INDEX `idx_box_code` ON `products` (`box_code`);--> statement-breakpoint
CREATE INDEX `idx_shipping_id` ON `products` (`shipping_id`);
