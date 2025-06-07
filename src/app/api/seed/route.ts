import { NextResponse } from "next/server";
import { PrismaClient, Day, UserSex } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Burada seeding əməliyyatlarını yaz (qısa versiya):
    await prisma.admin.upsert({
      where: { id: "admin1" },
      update: {},
      create: { id: "admin1", username: "admin1" },
    });
    await prisma.admin.upsert({
      where: { id: "admin2" },
      update: {},
      create: { id: "admin2", username: "admin2" },
    });

   // GRADE
    await prisma.grade.createMany({
      data: Array.from({ length: 6 }, (_, i) => ({ level: i + 1 })),
      skipDuplicates: true,
    });

    // CLASS
    await prisma.class.createMany({
      data: Array.from({ length: 6 }, (_, i) => ({
        name: `${i + 1}A`,
        gradeId: i + 1,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      })),
      skipDuplicates: true,
    });

    // SUBJECT
    const subjectData = [
      "Mathematics", "Science", "English", "History", "Geography",
      "Physics", "Chemistry", "Biology", "Computer Science", "Art"
    ].map(name => ({ name }));
    await prisma.subject.createMany({ data: subjectData, skipDuplicates: true });

    // TEACHER
    for (let i = 1; i <= 15; i++) {
      await prisma.teacher.upsert({
        where: { id: `teacher${i}` },
        update: {},
        create: {
          id: `teacher${i}`,
          username: `teacher${i}`,
          name: `TName${i}`,
          surname: `TSurname${i}`,
          email: `teacher${i}@example.com`,
          phone: `123-456-789${i}`,
          address: `Address${i}`,
          bloodType: "A+",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          subjects: { connect: [{ id: (i % 10) + 1 }] },
          classes: { connect: [{ id: (i % 6) + 1 }] },
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
        },
      });
    }
    // LESSON
    for (let i = 1; i <= 30; i++) {
      await prisma.lesson.create({
        data: {
          name: `Lesson${i}`,
          day: Day[
            Object.keys(Day)[
              Math.floor(Math.random() * Object.keys(Day).length)
            ] as keyof typeof Day
          ],
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
          subjectId: (i % 10) + 1,
          classId: (i % 6) + 1,
          teacherId: `teacher${(i % 15) + 1}`,
        },
      });
    }

   // PARENT
    await prisma.parent.createMany({
      data: Array.from({ length: 25 }, (_, i) => ({
        id: `parentId${i + 1}`,
        username: `parentId${i + 1}`,
        name: `PName ${i + 1}`,
        surname: `PSurname ${i + 1}`,
        email: `parent${i + 1}@example.com`,
        phone: `123-456-789${i + 1}`,
        address: `Address${i + 1}`,
      })),
      skipDuplicates: true,
    });

    // STUDENT
    for (let i = 1; i <= 50; i++) {
      await prisma.student.upsert({
        where: { id: `student${i}` },
        update: {},
        create: {
          id: `student${i}`,
          username: `student${i}`,
          name: `SName${i}`,
          surname: `SSurname ${i}`,
          email: `student${i}@example.com`,
          phone: `987-654-321${i}`,
          address: `Address${i}`,
          bloodType: "O-",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
          gradeId: (i % 6) + 1,
          classId: (i % 6) + 1,
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        },
      });
    }

    // EXAM
    for (let i = 1; i <= 10; i++) {
      await prisma.exam.create({
        data: {
          title: `Exam ${i}`,
          startTime: new Date(Date.now() + 3600 * 1000),
          endTime: new Date(Date.now() + 7200 * 1000),
          lessonId: (i % 30) + 1,
        },
      });
    }

    // ASSIGNMENT
    for (let i = 1; i <= 10; i++) {
      await prisma.assignment.create({
        data: {
          title: `Assignment ${i}`,
          startDate: new Date(Date.now() + 3600 * 1000),
          dueDate: new Date(Date.now() + 86400 * 1000),
          lessonId: (i % 30) + 1,
        },
      });
    }

    // RESULT
    for (let i = 1; i <= 10; i++) {
      await prisma.result.create({
        data: {
          score: 90,
          studentId: `student${i}`,
          ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
        },
      });
    }

    // ATTENDANCE
    for (let i = 1; i <= 10; i++) {
      await prisma.attendance.create({
        data: {
          date: new Date(),
          present: true,
          studentId: `student${i}`,
          lessonId: (i % 30) + 1,
        },
      });
    }

    // EVENT
    for (let i = 1; i <= 5; i++) {
      await prisma.event.create({
        data: {
          title: `Event ${i}`,
          description: `Description for Event ${i}`,
          startTime: new Date(Date.now() + 3600 * 1000),
          endTime: new Date(Date.now() + 7200 * 1000),
          classId: (i % 5) + 1,
        },
      });
    }

    // ANNOUNCEMENT
    for (let i = 1; i <= 5; i++) {
      await prisma.announcement.create({
        data: {
          title: `Announcement ${i}`,
          description: `Description for Announcement ${i}`,
          date: new Date(),
          classId: (i % 5) + 1,
        },
      });
    }

    // ...digər seeding addımları buraya əlavə olunur

    return NextResponse.json({ message: "Seeding completed successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Seeding failed.", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
