/*
  Warnings:

  - Added the required column `userType` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USERTYPE" AS ENUM ('STUDENT', 'TEACHER');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "userType" "USERTYPE" NOT NULL;
