-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
