import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { getRole, USER_ROLES } from "@/lib/utils";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const student:
    | (Student & { class: Class & { _count: { lessons: number } } })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  const role = await getRole();

  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* left */}
      <div className="w-full xl:w-2/3">
        {/* top */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* user info card */}
          <div className="bg-sky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || "/avatar.png"}
                alt=""
                width={100}
                height={100}
                className="w-30 h-30 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Leonard Snyder</h1>
                {role === USER_ROLES.ADMIN && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque
                hgkfjvh jrhbghu.
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-medium">
                <div className="w-full flex items-center gap-2">
                  <Image src="/blood.png" alt="blood" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/mail.png" alt="mail" width={14} height={14} />
                  <span>{student.email}</span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/phone.png" alt="phone" width={14} height={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* small cards */}
          <div className="flex-1 flex justify-between gap-2 flex-wrap">
            <div className="w-full bg-white p-4 rounded-md flex gap-2 md:w-[48%] xl:w-[47%] 2xl:w-[48%] xl:flex-col">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
             
             <Suspense fallback="Loading...">
              <StudentAttendanceCard id={student.id}/>
             </Suspense>
            </div>
            <div className="w-full bg-white p-4 rounded-md flex gap-2 md:w-[48%] xl:w-[47%] 2xl:w-[48%] xl:flex-col">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-500">Class</span>
              </div>
            </div>
            <div className="w-full bg-white p-4 rounded-md flex gap-2 md:w-[48%] xl:w-[47%] 2xl:w-[48%] xl:flex-col">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
                <span className="text-sm text-gray-500">Lessons</span>
              </div>
            </div>
            <div className="w-full bg-white p-4 rounded-md flex gap-2 md:w-[48%] xl:w-[47%] 2xl:w-[48%] xl:flex-col">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name.charAt(0)}th</h1>
                <span className="text-sm text-gray-500">Grade</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="font-semibold">Student&aposs Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-lg font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-skyLight"
              href={`/list/lessons?classId=${2}`}
            >
              {"Student's Lessons"}
            </Link>
            <Link
              className="p-3 rounded-md bg-purpleLight"
              href={`/list/teachers?classId=${2}`}
            >
              {"Student's Teachers"}
            </Link>
            <Link
              className="p-3 rounded-md bg-yellowLight"
              href={`/list/results?studentId=${"student1"}`}
            >
              {"Student's Results"}
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${2}`}
            >
              {"Student's Exams"}
            </Link>
            <Link
              className="p-3 rounded-md bg-sky"
              href={`/list/assignments?studentId=${"student1"}`}
            >
              {"Student's Assignments"}
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
