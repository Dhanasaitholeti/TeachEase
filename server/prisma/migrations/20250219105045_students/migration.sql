/*
  Warnings:

  - Added the required column `adress` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateofbirth` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gaurdianMobile` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gaurdianName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conductedById` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionPaper` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateEnum
CREATE TYPE "TESTTYPE" AS ENUM ('MCQ', 'THEORY', 'BLANKS', 'MIXED');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "adress" TEXT NOT NULL,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dateofbirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gaurdianMobile" TEXT NOT NULL,
ADD COLUMN     "gaurdianName" TEXT NOT NULL,
ADD COLUMN     "gender" "GENDER" NOT NULL,
ADD COLUMN     "govDocs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "stream" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "gender" "GENDER" NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT[];

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "conductedById" TEXT NOT NULL,
ADD COLUMN     "questionPaper" JSONB NOT NULL,
ADD COLUMN     "type" "TESTTYPE" NOT NULL;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_conductedById_fkey" FOREIGN KEY ("conductedById") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
