import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getRole } from "@/lib/utils";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

export type ExamList = Exam & {
  lesson: { class: Class; subject: Subject; teacher: Teacher };
};

const columns = [
  {
    header: "Subject",
    accessor: "subject",
    className: "text-left",
  },
  {
    header: "Class",
    accessor: "class",
    className: "text-left hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "text-left hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "text-left hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "text-left",
  },
];

const renderRow = async (item: ExamList) => {
  const role = await getRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.lesson.subject.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="exam" type="update" data={item} />
              <FormModal table="exam" type="delete" id={item.id} />
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

const ExamListPage = async ({ searchParams }: Prop) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const query: Prisma.ExamWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                lesson: {
                  subject: { name: { contains: value, mode: "insensitive" } },
                },
              },
              {
                lesson: {
                  teacher: { name: { contains: value, mode: "insensitive" } },
                },
              },
              {
                lesson: {
                  class: { name: { contains: value, mode: "insensitive" } },
                },
              },
            ];
            break;
          case "teacherId":
            query.lesson = {
              teacherId: value,
            };
            break;
          case "classId":
            query.lesson = {
              classId: parseInt(value),
            };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            class: { select: { name: true } },
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true, username: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold hidden md:block">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="exam" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ExamListPage;
