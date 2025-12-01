PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_debits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_id` integer,
	`receiver_id` integer,
	`shipping_id` integer,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'Dollar',
	`note` text,
	`transaction_date` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receiver_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipping_id`) REFERENCES `shipping`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_debits`("id", "sender_id", "receiver_id", "shipping_id", "amount", "currency", "note", "transaction_date", "created_at") SELECT "id", "sender_id", "receiver_id", "shipping_id", "amount", "currency", "note", "transaction_date", "created_at" FROM `debits`;--> statement-breakpoint
DROP TABLE `debits`;--> statement-breakpoint
ALTER TABLE `__new_debits` RENAME TO `debits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_debit_sender_id` ON `debits` (`sender_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_receiver_id` ON `debits` (`receiver_id`);--> statement-breakpoint
CREATE INDEX `idx_debit_shipping_id` ON `debits` (`shipping_id`);