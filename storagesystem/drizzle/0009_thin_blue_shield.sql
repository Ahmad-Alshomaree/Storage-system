CREATE TABLE `debits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`transaction_date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_debit_client_id` ON `debits` (`client_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_type` ON `debits` (`type`);