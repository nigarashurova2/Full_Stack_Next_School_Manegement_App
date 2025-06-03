import prisma from "@/lib/prisma";
import { currentUserId, getRole, USER_ROLES } from "@/lib/utils";

const Announcements = async () => {
  const role = await getRole();
  const userId = await currentUserId();

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const data = await prisma.announcement.findMany({
    where: {
      ...(role !== USER_ROLES.ADMIN && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
    take: 3,
    orderBy: { date: "desc" },
  });

  return (
    <div className="bg-white  p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        {data[0] && (
          <div className="bg-skyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">
                {data[0].title}
              </h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-xs mt-1 text-gray-400">
              {data[0].description}
            </p>
          </div>
        )}
        {data[1] && (
          <div className="bg-purpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">
                {data[1].title}
              </h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                 {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-xs mt-1 text-gray-400">
              {data[1].description}
            </p>
          </div>
        )}
        {data[2] && (
          <div className="bg-yellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">
                {data[2].title}
              </h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-xs mt-1 text-gray-400">
              {data[2].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
