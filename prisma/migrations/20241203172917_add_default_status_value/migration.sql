-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'open';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'active';
