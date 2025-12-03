ALTER TABLE `products` ADD `cost` real;--> statement-breakpoint
ALTER TABLE `products` ADD `total_cost` real DEFAULT 0;--> statement-breakpoint
UPDATE `products` SET `cost` = `original_price`, `total_cost` = `total_original_price`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `original_price`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `total_original_price`;--> statement-breakpoint
UPDATE `products` SET `cost` = 0 WHERE `cost` IS NULL;
