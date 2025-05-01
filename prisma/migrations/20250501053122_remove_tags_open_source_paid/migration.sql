/*
  Warnings:

  - You are about to drop the column `openSource` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Resource` table. All the data in the column will be lost.
  - Made the column `name` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_categoryId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "openSource",
DROP COLUMN "paid",
DROP COLUMN "tags",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
