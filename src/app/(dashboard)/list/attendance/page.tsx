import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, getRole, USER_ROLES } from "@/lib/utils";
import { Attendance, Lesson, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import { Check, X } from "lucide-react";

export type AttendanceList = Attendance & { student: Student } & {
  lesson: Lesson;
};

const renderRow = async (item: AttendanceList) => {
  const role = await getRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.student.name + " " + item.student.surname}
          </h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lesson.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      <td className="hidden md:table-cell">
        {item.present ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === USER_ROLES.ADMIN && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

type Prop = {
  searchParams: { [key: string]: string | undefined };
};

const AttendanceListPage = async ({ searchParams }: Prop) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  let query: Prisma.AttendanceWhereInput = {};
  const role = await getRole();
  const userId = await currentUserId();

  // ROLE CONDITION
  const roleConditions = {
    admin: {},
    teacher: { lesson: { teacherId: userId } },
    student: { studentId: userId },
    parent: { student: { parentId: userId } },
  };

  query = roleConditions[role as keyof typeof roleConditions] || {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [];
            break;
          case "classId":
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      orderBy: {
        id: "desc",
      },
      include: { lesson: true, student: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Student",
      accessor: "studentId",
      className: "text-left",
    },
    {
      header: "Lesson",
      accessor: "lessonId",
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Present",
      accessor: "present",
      className: "text-left hidden md:table-cell",
    },
    ...(role === USER_ROLES.ADMIN
      ? [
          {
            header: "Actions",
            accessor: "action",
            className: "text-left",
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold hidden md:block">
          All Attendance
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormContainer table="attendance" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
