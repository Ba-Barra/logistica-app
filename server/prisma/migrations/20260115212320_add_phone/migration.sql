/*
  Warnings:

  - Added the required column `phone` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `latitude` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "latitude" SET DEFAULT -33.4489,
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "longitude" SET DEFAULT -70.6693;
