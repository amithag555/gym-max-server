-- AlterTable
ALTER TABLE `member` MODIFY `password` VARCHAR(100) NOT NULL DEFAULT '0000';

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(100) NOT NULL;
