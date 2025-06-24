/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoryId` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Made the column `unitOfMeasurement` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "categoryId",
DROP COLUMN "subCategoryId",
DROP COLUMN "subcategoryId",
ADD COLUMN     "CategoryId" INTEGER,
ADD COLUMN     "SubCategoryId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "unitOfMeasurement" SET NOT NULL;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_productId_key" ON "Item"("productId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_SubCategoryId_fkey" FOREIGN KEY ("SubCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
