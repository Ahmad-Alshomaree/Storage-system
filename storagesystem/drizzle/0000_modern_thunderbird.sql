CREATE TABLE `client` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`phone_number` text,
	`shipping_id` integer,
	`history` text,
	FOREIGN KEY (`shipping_id`) REFERENCES `shipping`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_client_name` ON `client` (`client_name`);--> statement-breakpoint
CREATE INDEX `idx_client_shipping_id` ON `client` (`shipping_id`);--> statement-breakpoint
CREATE TABLE `debits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_id` integer,
	`receiver_id` integer,
	`shipping_id` integer,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'Dollar',
	`note` text,
	`transaction_date` text,
	`total_debit` real,
	`created_at` text NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipping_id`) REFERENCES `shipping`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_debit_sender_id` ON `debits` (`sender_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_receiver_id` ON `debits` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_shipping_id` ON `debits` (`shipping_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`shipping_id` integer,
	`box_code` text NOT NULL,
	`product_name` text,
	`original_price` real NOT NULL,
	`selling_price` real NOT NULL,
	`storage` text,
	`weight` real,
	`image` text,
	`pice_per_box` integer,
	`Total_pices` integer DEFAULT 0,
	`total_original_price` real DEFAULT 0,
	`size_of_box` real NOT NULL,
	`total_box_size` real NOT NULL,
	`number_of_boxes` integer NOT NULL,
	`extracted_pieces` integer DEFAULT 0,
	`status` text DEFAULT 'available',
	`Grope_Item_price` real,
	`currency` text NOT NULL,
	`note` text,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`shipping_id`) REFERENCES `shipping`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_product_name` ON `products` (`product_name`);--> statement-breakpoint
CREATE INDEX `idx_box_code` ON `products` (`box_code`);--> statement-breakpoint
CREATE INDEX `idx_shipping_id` ON `products` (`shipping_id`);--> statement-breakpoint
CREATE TABLE `shipping` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`shipping_date` text NOT NULL,
	`receiving_date` text NOT NULL,
	`receiver_client_id` integer NOT NULL,
	`sender_client_id` integer NOT NULL,
	`file_path` text,
	`paid` integer DEFAULT 0,
	`ship_price` real DEFAULT 0,
	`currency` text DEFAULT 'Dollar',
	`note` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`receiver_client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_shipping_type` ON `shipping` (`type`);--> statement-breakpoint
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
CREATE INDEX `idx_store_product_id` ON `store_products` (`product_id`);