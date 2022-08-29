/*
  Warnings:

  - Added the required column `password` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `password` VARCHAR(25) NOT NULL;
