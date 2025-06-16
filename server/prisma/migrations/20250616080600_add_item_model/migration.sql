/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_subcategoryId_fkey";

-- DropIndex
DROP INDEX "Item_productId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "subCategoryId" INTEGER,
ALTER COLUMN "unitOfMeasurement" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
