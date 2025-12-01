/*
  Warnings:

  - You are about to drop the `TestCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestProductItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TestIngredientToTestProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestProduct" DROP CONSTRAINT "TestProduct_testCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "TestProductItem" DROP CONSTRAINT "TestProductItem_testProductId_fkey";

-- DropForeignKey
ALTER TABLE "_TestIngredientToTestProduct" DROP CONSTRAINT "_TestIngredientToTestProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestIngredientToTestProduct" DROP CONSTRAINT "_TestIngredientToTestProduct_B_fkey";

-- DropTable
DROP TABLE "TestCategory";

-- DropTable
DROP TABLE "TestIngredient";

-- DropTable
DROP TABLE "TestProduct";

-- DropTable
DROP TABLE "TestProductItem";

-- DropTable
DROP TABLE "_TestIngredientToTestProduct";
