-- CreateTable
CREATE TABLE "user_resource_like" (
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_resource_like_pkey" PRIMARY KEY ("userId","resourceId")
);

-- AddForeignKey
ALTER TABLE "user_resource_like" ADD CONSTRAINT "user_resource_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_resource_like" ADD CONSTRAINT "user_resource_like_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
