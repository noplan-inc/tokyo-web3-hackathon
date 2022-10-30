-- Add migration script here

CREATE TABLE `Users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL
);

CREATE TABLE `WebSites` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `token_id` VARCHAR(191) NOT NULL
);

