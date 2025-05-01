/*
  Warnings:

  - You are about to drop the column `favorites` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `user_resource_like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_resource_like" DROP CONSTRAINT "user_resource_like_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "user_resource_like" DROP CONSTRAINT "user_resource_like_userId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "favorites",
ADD COLUMN     "bookmarkCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "user_resource_like";

-- CreateTable
CREATE TABLE "user_resource_bookmark" (
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_resource_bookmark_pkey" PRIMARY KEY ("userId","resourceId")
);

-- AddForeignKey
ALTER TABLE "user_resource_bookmark" ADD CONSTRAINT "user_resource_bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resource_bookmark" ADD CONSTRAINT "user_resource_bookmark_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
