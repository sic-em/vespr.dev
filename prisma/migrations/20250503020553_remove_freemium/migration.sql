/*
  Warnings:

  - The values [FREE_WITH_LIMIT] on the enum `ResourcePrice` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourcePrice_new" AS ENUM ('FREE', 'PAID');
ALTER TABLE "Resource" ALTER COLUMN "price" DROP DEFAULT;
ALTER TABLE "Resource" ALTER COLUMN "price" TYPE "ResourcePrice_new" USING ("price"::text::"ResourcePrice_new");
ALTER TYPE "ResourcePrice" RENAME TO "ResourcePrice_old";
ALTER TYPE "ResourcePrice_new" RENAME TO "ResourcePrice";
DROP TYPE "ResourcePrice_old";
ALTER TABLE "Resource" ALTER COLUMN "price" SET DEFAULT 'FREE';
COMMIT;
