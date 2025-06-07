import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { getRole, USER_ROLES } from "@/lib/utils";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleTeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const teacher:
    | (Teacher & {
        _count: { subjects: number; lessons: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true,
        },
      },
    },
  });

  const role = await getRole();

  if (!teacher) {
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
              {/* <Image
                src={teacher.img || "/avatar.png"}
                alt="profileImage"
                width={100}
                height={100}
                className="w-30 h-30 rounded-full object-cover"
              /> */}
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {teacher.name + " " + teacher.surname}
                </h1>
                {role === USER_ROLES.ADMIN && (
                  <FormContainer table="teacher" type="update" data={teacher} />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque
                hgkfjvh jrhbghu.
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-medium">
                <div className="w-full flex items-center gap-2">
                  <Image src="/blood.png" alt="blood" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/date.png" alt="date" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}
                  </span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/mail.png" alt="mail" width={14} height={14} />
                  <span>{teacher.email || "-"}</span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <Image src="/phone.png" alt="phone" width={14} height={14} />
                  <span>{teacher.phone || "-"}</span>
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
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-500">Attendance</span>
              </div>
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
                <h1 className="text-xl font-semibold">{teacher._count.classes}</h1>
                <span className="text-sm text-gray-500">Classes</span>
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
                <h1 className="text-xl font-semibold">{teacher._count.lessons}</h1>
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
                <h1 className="text-xl font-semibold">{teacher._count.subjects}</h1>
                <span className="text-sm text-gray-500">Branches</span>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="font-semibold">Teacher$aposs Schedule</h1>
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
              href={`/list/classes?supervisorId=${"teacher1"}`}
            >
              {"Teacher's Classes"}
            </Link>
            <Link
              className="p-3 rounded-md bg-purpleLight"
              href={`/list/students?teacherId=${"teacher1"}`}
            >
              {"Teacher's Students"}
            </Link>
            <Link
              className="p-3 rounded-md bg-yellowLight"
              href={`/list/lessons?teacherId=${"teacher1"}`}
            >
              {"Teacher's Lessons"}
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${"teacher1"}`}
            >
              {"Teacher's Exams"}
            </Link>
            <Link
              className="p-3 rounded-md bg-sky"
              href={`/list/assignments?teacherId=${"teacher1"}`}
            >
              {"Teacher's Assignments"}
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
