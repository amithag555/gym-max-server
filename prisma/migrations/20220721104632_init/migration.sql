-- CreateTable
CREATE TABLE `Club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `phoneNumber` VARCHAR(10) NOT NULL,
    `currentMembersCount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NULL,
    `lastName` VARCHAR(50) NULL,
    `role` ENUM('MEMBER', 'ADMIN', 'RECEPTION', 'SELLER', 'TRAINER') NOT NULL,
    `password` VARCHAR(25) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NULL,
    `phoneNumber` VARCHAR(10) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `fullName` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NULL,
    `phoneNumber` VARCHAR(10) NOT NULL,
    `role` ENUM('MEMBER', 'ADMIN', 'RECEPTION', 'SELLER', 'TRAINER') NOT NULL DEFAULT 'MEMBER',
    `email` VARCHAR(100) NOT NULL,
    `imgUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiredDate` DATETIME(3) NOT NULL,
    `isEntry` BOOLEAN NOT NULL DEFAULT false,
    `isFirstLogin` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Member_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutGoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `trainingNumber` INTEGER NOT NULL,
    `currentTrainingNumber` INTEGER NOT NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `trainerName` VARCHAR(50) NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlainItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `muscleName` VARCHAR(50) NOT NULL,
    `trainingPlanId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `setsNumber` INTEGER NOT NULL,
    `repetitionsNumber` INTEGER NOT NULL,
    `machineNumber` VARCHAR(25) NULL,
    `weight` INTEGER NULL,
    `plainItemId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `context` VARCHAR(300) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GymClass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SPINNING', 'BOXING', 'SWIMMING', 'BODYSHAPE', 'YOGA') NOT NULL,
    `trainer` VARCHAR(50) NOT NULL,
    `day` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startHour` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `roomNumber` INTEGER NOT NULL,
    `maxMembers` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Training` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NULL,
    `endtTime` DATETIME(3) NULL,
    `type` ENUM('AEROBIC', 'SWIMMING', 'GYMCLASS', 'A', 'B', 'C', 'FULLBODY') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkDayActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityPerHour` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hour` DATETIME(3) NOT NULL,
    `count` INTEGER NOT NULL,
    `workDayActivityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('ENTRY', 'EXIT') NOT NULL,
    `memberId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MemberToNotification` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MemberToNotification_AB_unique`(`A`, `B`),
    INDEX `_MemberToNotification_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GymClassToMember` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GymClassToMember_AB_unique`(`A`, `B`),
    INDEX `_GymClassToMember_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutGoal` ADD CONSTRAINT `WorkoutGoal_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainingPlan` ADD CONSTRAINT `TrainingPlan_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlainItem` ADD CONSTRAINT `PlainItem_trainingPlanId_fkey` FOREIGN KEY (`trainingPlanId`) REFERENCES `TrainingPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_plainItemId_fkey` FOREIGN KEY (`plainItemId`) REFERENCES `PlainItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityPerHour` ADD CONSTRAINT `ActivityPerHour_workDayActivityId_fkey` FOREIGN KEY (`workDayActivityId`) REFERENCES `WorkDayActivity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberToNotification` ADD CONSTRAINT `_MemberToNotification_A_fkey` FOREIGN KEY (`A`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberToNotification` ADD CONSTRAINT `_MemberToNotification_B_fkey` FOREIGN KEY (`B`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GymClassToMember` ADD CONSTRAINT `_GymClassToMember_A_fkey` FOREIGN KEY (`A`) REFERENCES `GymClass`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GymClassToMember` ADD CONSTRAINT `_GymClassToMember_B_fkey` FOREIGN KEY (`B`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
