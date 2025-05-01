-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_categoryId_fkey";

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
