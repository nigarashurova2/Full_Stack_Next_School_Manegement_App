import Announcements from "@/components/Announcements";
import dynamic from "next/dynamic";

const BigCalendar = dynamic(() => import('@/components/BigCalendar'), {
  ssr: false,
});
const EventCalendar = dynamic(() => import('@/components/EventCalendar'), {
  ssr: false,
});

const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">

      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendar/>
        </div>
      </div>

      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
