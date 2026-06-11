/*
  Warnings:

  - You are about to drop the column `followerCount` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "followerCount",
DROP COLUMN "followingCount",
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
