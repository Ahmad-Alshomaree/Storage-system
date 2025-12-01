PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_debits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_id` integer,
	`receiver_id` integer,
	`shipping_id` integer,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`transaction_date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipping_id`) REFERENCES `shipping`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_debits`("id", "sender_id", "receiver_id", "shipping_id", "amount", "type", "description", "transaction_date", "created_at") SELECT "id", "client_id", "client_id", "shipping_id", "amount", "type", "description", "transaction_date", "created_at" FROM `debits`;--> statement-breakpoint
DROP TABLE `debits`;--> statement-breakpoint
ALTER TABLE `__new_debits` RENAME TO `debits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_debit_sender_id` ON `debits` (`sender_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_receiver_id` ON `debits` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_shipping_id` ON `debits` (`shipping_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_type` ON `debits` (`type`);--> statement-breakpoint
CREATE TABLE `__new_products` (
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
INSERT INTO `__new_products`("id", "shipping_id", "box_code", "product_name", "original_price", "selling_price", "storage", "weight", "image", "pice_per_box", "Total_pices", "total_original_price", "size_of_box", "total_box_size", "number_of_boxes", "extracted_pieces", "status", "Grope_Item_price", "currency", "note", "created_at", "updated_at") SELECT "id", "shipping_id", "box_code", "product_name", "original_price", "selling_price", "storage", "weight", "image", "pice_per_box", "Total_pices", "total_original_price", "size_of_box", "total_box_size", "number_of_boxes", "extracted_pieces", "status", "Grope_Item_price", "currency", "note", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE INDEX `idx_product_name` ON `products` (`product_name`);--> statement-breakpoint
CREATE INDEX `idx_box_code` ON `products` (`box_code`);--> statement-breakpoint
CREATE INDEX `idx_shipping_id` ON `products` (`shipping_id`);--> statement-breakpoint
ALTER TABLE `client` DROP COLUMN `debt`;--> statement-breakpoint
ALTER TABLE `client` DROP COLUMN `total_debts`;
