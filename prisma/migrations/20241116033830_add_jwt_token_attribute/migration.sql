/*
  Warnings:

  - Added the required column `jwt_token` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "jwt_token" TEXT NOT NULL;
