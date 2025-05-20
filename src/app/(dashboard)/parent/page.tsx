import Announcements from "@/components/Announcements";
import dynamic from "next/dynamic";

const BigCalendar = dynamic(() => import('@/components/BigCalendar'), {
  ssr: false,
});

const ParentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">

      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (John Doe)</h1>
          <BigCalendar/>
        </div>
      </div>

      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
