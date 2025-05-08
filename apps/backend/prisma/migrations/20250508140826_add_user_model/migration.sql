/*
  Warnings:

  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create default admin user
INSERT INTO "User" ("email", "password", "name", "role", "createdAt", "updatedAt")
VALUES ('admin@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9Uu', 'Admin User', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add userId column to Product
ALTER TABLE "Product" ADD COLUMN "userId" INTEGER;

-- Update existing products to be associated with the admin user
UPDATE "Product" SET "userId" = 1;

-- Make userId required
ALTER TABLE "Product" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
