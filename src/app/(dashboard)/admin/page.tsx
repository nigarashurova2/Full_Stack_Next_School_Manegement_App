import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import dynamic from "next/dynamic";

const EventCalendarContainer = dynamic(() => import('@/components/EventCalendarContainer'), {
  ssr: false,
});

const AdminPage = async ({searchParams ={}}: {searchParams:{[key:string]: string | undefined }}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* user card */}
      <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="admin"/>
        <UserCard type="teacher"/>
        <UserCard type="student"/>
        <UserCard type="parent"/>
      </div>
      {/* middle chart */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* count chart */}
        <div className="w-full lg:w-1/3 h-[400px]">
          <CountChartContainer/>
        </div>
        {/* attendance chart */}
        <div className="w-full lg:w-2/3 h-[400px]">
          <AttendanceChartContainer/>
        </div>
      </div>
      {/* bottom charts */}
        <div className="w-full h-[500px]">
          <FinanceChart/>
        </div>
      </div>
      {/* right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcements/>
      </div>
    </div>
  )
}

export default AdminPage;