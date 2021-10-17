/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Bucket` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Bucket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Bucket` DROP FOREIGN KEY `Bucket_creatorId_fkey`;

-- AlterTable
ALTER TABLE `Bucket` DROP COLUMN `creatorId`,
    ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Bucket` ADD CONSTRAINT `Bucket_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
