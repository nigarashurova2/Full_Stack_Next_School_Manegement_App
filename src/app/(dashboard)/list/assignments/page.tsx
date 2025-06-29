import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, getRole, USER_ROLES } from "@/lib/utils";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

export type AssignmentList = Assignment & {
  lesson: { class: Class; subject: Subject; teacher: Teacher };
};

const renderRow = async (item: AssignmentList) => {
  const role = await getRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.lesson.subject.name}</td>
      <td className="hidden md:table-cell">{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.username}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === USER_ROLES.ADMIN || role === USER_ROLES.TEACHER) && (
            <>
              <FormContainer table="assignment" type="update" data={item} />
              <FormContainer table="assignment" type="delete" id={item.id} />
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
const AssignmentListPage = async ({ searchParams }: Prop) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const query: Prisma.AssignmentWhereInput = {};
  query.lesson = {};
  const role = await getRole();
  const userId = await currentUserId();

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.lesson.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION
  switch (role) {
    case USER_ROLES.ADMIN:
      break;
    case USER_ROLES.TEACHER:
      query.lesson.teacherId = userId;
      break;
    case USER_ROLES.STUDENT:
      query.lesson.class = {
        students: {
          some: { id: userId },
        },
      };
    case USER_ROLES.PARENT:
      query.lesson.class = {
        students: {
          some: {
            parentId: userId,
          },
        },
      };
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      orderBy: {
        id: "desc",
      },
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
    prisma.assignment.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Title",
      accessor: "title",
      className: "text-left",
    },
    {
      header: "Subject",
      accessor: "subject",
      className: "text-left hidden md:table-cell",
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
      header: "Due Date",
      accessor: "dueDate",
      className: "text-left hidden md:table-cell",
    },
    ...(role === USER_ROLES.ADMIN || role === USER_ROLES.TEACHER
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
          All Assignments
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
            <FormContainer table="assignment" type="create" />
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

export default AssignmentListPage;
