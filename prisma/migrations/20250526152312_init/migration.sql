/*
  Warnings:

  - You are about to drop the column `endTime` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Teacher` table. All the data in the column will be lost.
  - The primary key for the `_SubjectToTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[level]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_SubjectToTeacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueDate` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `birthday` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropIndex
DROP INDEX "Grade_name_key";

-- DropIndex
DROP INDEX "Lesson_name_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "supervisorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "name",
ADD COLUMN     "level" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "bloodType",
DROP COLUMN "createAt",
DROP COLUMN "gender",
DROP COLUMN "img",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "createAt",
DROP COLUMN "gender",
DROP COLUMN "updateAt",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sex" "UserSex" NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "createAt",
DROP COLUMN "gender",
DROP COLUMN "updateAt",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sex" "UserSex" NOT NULL;

-- AlterTable
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_AB_pkey";

-- DropEnum
DROP TYPE "UserGender";

-- CreateIndex
CREATE UNIQUE INDEX "Grade_level_key" ON "Grade"("level");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToTeacher_AB_unique" ON "_SubjectToTeacher"("A", "B");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
