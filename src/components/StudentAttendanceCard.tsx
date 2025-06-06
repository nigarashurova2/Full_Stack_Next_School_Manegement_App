import prisma from "@/lib/prisma";

const StudentAttendanceCard = async ({id}:{id: string}) => {
  
  const attendance = await prisma.attendance.findMany({
    where: {
      studentId: id,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1)
      }
    }
  })

  const presentDays = attendance.filter(data=> data.present).length
  const totalDays = attendance.length;
  const persentage = (presentDays / totalDays) * 100

  return (
    <div>
      <h1 className="text-xl font-semibold">{persentage}%</h1>
      <span className="text-sm text-gray-500">Attendance</span>
    </div>
  );
};

export default StudentAttendanceCard;
