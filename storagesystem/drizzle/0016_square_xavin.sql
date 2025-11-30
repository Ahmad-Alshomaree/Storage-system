CREATE TABLE `store_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`individual_item_selling_price` real NOT NULL,
	`image` text,
	`group_item_price` real,
	`number_of_items` integer NOT NULL,
	`entered_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_store_product_id` ON `store_products` (`product_id`);--> statement-breakpoint
ALTER TABLE `products` ADD `currency` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `note` text;