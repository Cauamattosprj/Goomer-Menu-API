/*
  Warnings:

  - The primary key for the `product_promotions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_promotions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."product_promotions_product_id_promotion_id_key";

-- AlterTable
ALTER TABLE "product_promotions" DROP CONSTRAINT "product_promotions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "product_promotions_pkey" PRIMARY KEY ("product_id", "promotion_id");
