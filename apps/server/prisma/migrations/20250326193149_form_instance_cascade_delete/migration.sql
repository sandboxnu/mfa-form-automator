-- DropForeignKey
ALTER TABLE "AssignedGroup" DROP CONSTRAINT "AssignedGroup_fieldGroupId_fkey";

-- DropForeignKey
ALTER TABLE "AssignedGroup" DROP CONSTRAINT "AssignedGroup_formInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "InstanceBox" DROP CONSTRAINT "InstanceBox_assignedGroupId_fkey";

-- DropForeignKey
ALTER TABLE "InstanceBox" DROP CONSTRAINT "InstanceBox_templateBoxId_fkey";

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_formInstanceId_fkey" FOREIGN KEY ("formInstanceId") REFERENCES "FormInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_fieldGroupId_fkey" FOREIGN KEY ("fieldGroupId") REFERENCES "FieldGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceBox" ADD CONSTRAINT "InstanceBox_assignedGroupId_fkey" FOREIGN KEY ("assignedGroupId") REFERENCES "AssignedGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceBox" ADD CONSTRAINT "InstanceBox_templateBoxId_fkey" FOREIGN KEY ("templateBoxId") REFERENCES "TemplateBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
