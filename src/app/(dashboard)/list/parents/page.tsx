import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, getRole, USER_ROLES } from "@/lib/utils";
import { Parent, Prisma, Student } from "@prisma/client";
import Image from "next/image";

export type ParentList = Parent & { students: Student[] };

const renderRow = async (item: ParentList) => {
  const role = await getRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.students.map((student) => student.name).join(", ")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === USER_ROLES.ADMIN && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
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

const ParentListPage = async ({ searchParams }: Prop) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const query: Prisma.ParentWhereInput = {};
  const role = await getRole();
  const userId = await currentUserId();

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;

          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "text-left",
    },
    {
      header: "Student Names",
      accessor: "students",
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "text-left hidden md:table-cell",
    },
    {
      header: "Address",
      accessor: "address",
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
        <h1 className="text-lg font-semibold hidden md:block">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="parent" type="create" />
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

export default ParentListPage;
