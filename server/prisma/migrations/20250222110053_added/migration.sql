/*
  Warnings:

  - You are about to drop the column `relatedTo` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `relatedUserId` on the `Reminder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_admin_relatedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_teacher_relatedUserId_fkey";

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "relatedTo",
DROP COLUMN "relatedUserId",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "teacherId" TEXT;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_teacher_relatedUserId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_admin_relatedUserId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
