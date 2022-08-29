/*
  Warnings:

  - You are about to drop the column `password` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `password`;

-- AlterTable
ALTER TABLE `member` ADD COLUMN `password` VARCHAR(25) NOT NULL DEFAULT '0000';
