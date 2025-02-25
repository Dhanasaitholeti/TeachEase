/*
  Warnings:

  - You are about to drop the column `stream` on the `Student` table. All the data in the column will be lost.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PRESENT', 'ABSENT', 'HALFDAY');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "status" "STATUS" NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "stream";
