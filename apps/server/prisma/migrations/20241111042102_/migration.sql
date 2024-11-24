-- AlterEnum
ALTER TYPE "SignerType" ADD VALUE 'USER_LIST';

-- CreateTable
CREATE TABLE "_AssignedUserList" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedUserList_AB_unique" ON "_AssignedUserList"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedUserList_B_index" ON "_AssignedUserList"("B");

-- AddForeignKey
ALTER TABLE "_AssignedUserList" ADD CONSTRAINT "_AssignedUserList_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedUserList" ADD CONSTRAINT "_AssignedUserList_B_fkey" FOREIGN KEY ("B") REFERENCES "Signature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
