-- CreateEnum
CREATE TYPE "ResourcePrice" AS ENUM ('FREE', 'PAID', 'FREE_WITH_LIMIT');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "price" "ResourcePrice" NOT NULL DEFAULT 'FREE';
