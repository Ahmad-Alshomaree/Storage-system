CREATE TABLE `client` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`phone_number` text,
	`shipping_id` integer,
	`history` text,
	`debt` real DEFAULT 0 NOT NULL,
	`total_debts` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_client_name` ON `client` (`client_name`);--> statement-breakpoint
CREATE INDEX `idx_client_shipping_id` ON `client` (`shipping_id`);