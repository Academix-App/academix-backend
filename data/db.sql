DROP DATABASE IF EXISTS academix;

CREATE DATABASE IF NOT EXISTS academix;
USE academix;

CREATE TABLE `accounts` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(256) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(256) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`phone` VARCHAR(15) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(512) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`created_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	`updated_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `recovery_codes` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`account_id` INT(11) NOT NULL,
	`code` VARCHAR(6) NOT NULL COLLATE 'utf8mb4_general_ci',
	`created_at` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
	`updated_at` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `fk_recovery_account` (`account_id`) USING BTREE,
	CONSTRAINT `fk_recovery_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `disciplines` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`account_id` INT(11) NOT NULL,
	`name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_general_ci',
	`teacher` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_general_ci',
	`color` VARCHAR(7) NOT NULL COLLATE 'utf8mb4_general_ci',
	`created_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	`updated_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `fk_discipline_account` (`account_id`) USING BTREE,
	CONSTRAINT `fk_discipline_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `activities` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`account_id` INT(11) NOT NULL,
	`discipline_id` INT(11) NOT NULL,
	`title` VARCHAR(128) NOT NULL,
	`color` VARCHAR(7) NOT NULL,
	`type` ENUM('EXAM', 'PRESENTATION', 'ASSIGNMENT', 'OTHER') NOT NULL,
	`status` ENUM('not_delivered', 'delivered') NOT NULL DEFAULT 'not_delivered',
	`description` VARCHAR(128) NULL DEFAULT NULL,
	`start_date` BIGINT(20) NOT NULL,
	`end_date` BIGINT(20) NOT NULL,
	`created_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	`updated_at` BIGINT(20) NULL DEFAULT (unix_timestamp() * 1000),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `fk_activity_account` (`account_id`) USING BTREE,
	INDEX `fk_activity_discipline` (`discipline_id`) USING BTREE,
	CONSTRAINT `fk_activity_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `fk_activity_discipline` FOREIGN KEY (`discipline_id`) REFERENCES `disciplines` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `contents` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `account_id` INT(11) NOT NULL,
    `content` TEXT NOT NULL,
    `notifications` TINYINT(4) NOT NULL DEFAULT 0,
    `create_timestamp` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
    `last_notification_timestamp` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `fk_content_account` (`account_id`) USING BTREE,
    CONSTRAINT `fk_content_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `content_summaries` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `content_id` INT(11) NOT NULL,
    `summary` TEXT NOT NULL,
    `created_at` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `fk_summary_content` (`content_id`) USING BTREE,
    CONSTRAINT `fk_summary_content` FOREIGN KEY (`content_id`) REFERENCES `contents` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `content_chats` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `content_id` INT(11) NOT NULL,
    `account_id` INT(11) NOT NULL,
    `role` ENUM('user', 'assistant') NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `fk_chat_content` (`content_id`) USING BTREE,
    INDEX `fk_chat_account` (`account_id`) USING BTREE,
    CONSTRAINT `fk_chat_content` FOREIGN KEY (`content_id`) REFERENCES `contents` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_chat_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;

CREATE TABLE `verifications` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `account_id` INT(11) NOT NULL,
    `input` TEXT NOT NULL,
    `percentage` TINYINT(4) NOT NULL,
    `justification` TEXT NOT NULL,
    `created_at` BIGINT(20) NOT NULL DEFAULT (unix_timestamp() * 1000),
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `fk_verification_account` (`account_id`) USING BTREE,
    CONSTRAINT `fk_verification_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB;