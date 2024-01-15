CREATE TABLE `blocks` (
	`number` integer PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`recipient` text NOT NULL,
	`reward` text,
	`timestamp` integer NOT NULL,
	`gasUsed` text NOT NULL,
	`gasLimit` text NOT NULL,
	`baseFee` integer NOT NULL,
	`burntFees` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`hash` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text,
	`timestamp` integer NOT NULL,
	`value` text,
	`blockNumber` integer NOT NULL
);
