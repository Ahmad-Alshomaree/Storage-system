CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_room_name` ON `rooms` (`room_name`);