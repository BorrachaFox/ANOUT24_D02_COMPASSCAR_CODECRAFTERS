/*
  Warnings:

  - Added the required column `daily_price` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "daily_price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "update_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "update_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "update_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "update_at" SET DEFAULT CURRENT_TIMESTAMP;
