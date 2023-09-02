-- CreateTable
CREATE TABLE "Board" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" VARCHAR(32) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "lastCommentNumber" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardSlug" VARCHAR(32) NOT NULL,
    "numberOnBoard" BIGINT NOT NULL,
    "email" VARCHAR(256),
    "name" VARCHAR(256),
    "subject" VARCHAR(256),
    "comment" TEXT NOT NULL,
    "file" VARCHAR(512),
    "password" VARCHAR(8) NOT NULL,
    "parentId" UUID,
    "lastHit" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "Board"("slug");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
