ALTER TABLE `debits` ADD `currency` text DEFAULT 'Dollar';--> statement-breakpoint
ALTER TABLE `debits` ADD `note` text;--> statement-breakpoint
ALTER TABLE `debits` DROP COLUMN `description`;