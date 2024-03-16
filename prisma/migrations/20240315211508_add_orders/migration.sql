/*
  Warnings:

  - A unique constraint covering the columns `[tg_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tg_username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tg_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tg_username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tg_id" INT4 NOT NULL;
ALTER TABLE "User" ADD COLUMN     "tg_username" STRING NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" STRING NOT NULL,
    "dateIn" TIMESTAMP(3) NOT NULL,
    "duration" INT4 NOT NULL,
    "country" STRING NOT NULL,
    "hotel" STRING NOT NULL,
    "pansion" STRING NOT NULL,
    "room_type" STRING NOT NULL,
    "price" INT4 NOT NULL,
    "available_places" STRING NOT NULL,
    "price_with_loss" INT4 NOT NULL,
    "category" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tg_id_key" ON "User"("tg_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_tg_username_key" ON "User"("tg_username");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
