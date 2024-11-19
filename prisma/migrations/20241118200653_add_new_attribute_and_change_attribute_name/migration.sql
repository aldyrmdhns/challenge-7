/*
  Warnings:

  - You are about to drop the column `jwt_token` on the `user` table. All the data in the column will be lost.
  - Added the required column `activation_token` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reset_pw_token` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "jwt_token",
ADD COLUMN     "activation_token" TEXT NOT NULL,
ADD COLUMN     "reset_pw_token" TEXT NOT NULL;
