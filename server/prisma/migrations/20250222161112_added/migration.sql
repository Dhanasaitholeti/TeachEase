/*
  Warnings:

  - The values [WEEKLY,UA,SA] on the enum `EXAMTYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EXAMTYPE_new" AS ENUM ('SA1', 'SA2', 'SA3');
ALTER TABLE "Test" ALTER COLUMN "examType" DROP DEFAULT;
ALTER TABLE "Test" ALTER COLUMN "examType" TYPE "EXAMTYPE_new" USING ("examType"::text::"EXAMTYPE_new");
ALTER TYPE "EXAMTYPE" RENAME TO "EXAMTYPE_old";
ALTER TYPE "EXAMTYPE_new" RENAME TO "EXAMTYPE";
DROP TYPE "EXAMTYPE_old";
COMMIT;

-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "examType" DROP NOT NULL,
ALTER COLUMN "examType" DROP DEFAULT;
