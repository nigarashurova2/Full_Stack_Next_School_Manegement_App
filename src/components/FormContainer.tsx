import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import { USER_ROLES } from "@/lib/utils";

export type Table =
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement";

type Type = "create" | "update" | "delete";

export type FormContainerProps = {
  table: Table;
  type: Type;
  data?: any;
  id?: number | string;
};
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teachersSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teachersSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });

        const parents = await prisma.parent.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = {
          classes: studentClasses,
          grades: studentGrades,
          parents,
        };
        break;
      case "exam":
        const { userId, sessionClaims } = await auth();
        const role = (
          sessionClaims?.metadata as {
            role: "admin" | "teacher" | "student" | "parent";
          }
        )?.role;

        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === USER_ROLES.TEACHER ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      case "parent":
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { students: parentStudents };
        break;
      case "lesson":
        const subjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        const classes = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });

        const teachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { subjects, classes, teachers };
        break;
      case "event":
        const eventClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: eventClasses };
        break;
      case "result":
        const resultExams = await prisma.exam.findMany({
          select: { id: true, title: true },
        });
        const resultAssignments = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });
        const resultStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = {
          exams: resultExams,
          assignments: resultAssignments,
          students: resultStudents,
        };
        break;
      case "announcement":
        const announcementClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: announcementClasses };
        break;
      case "assignment":
        const lessons = await prisma.lesson.findMany({
          select: { id: true, name: true },
        });
        relatedData = { lessons };
        break;
      case "attendance":
        const attendanceLessons = await prisma.lesson.findMany({
          select: { id: true, name: true },
        });
        const attendanceStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { lessons:attendanceLessons, students: attendanceStudents };
        break;
      default:
        break;
    }
  }
  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedData}
    />
  );
};

export default FormContainer;
