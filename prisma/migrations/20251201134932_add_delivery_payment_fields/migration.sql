-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryType" TEXT NOT NULL DEFAULT 'delivery',
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'cash';
