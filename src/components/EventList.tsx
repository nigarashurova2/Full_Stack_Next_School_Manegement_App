import prisma from "@/lib/prisma";

const EventList = async ({dateParam} : {dateParam: string | undefined}) => {
  //TEMPORARY

  const date = dateParam ? new Date(dateParam) : new Date()
  console.log(dateParam, "dateparam");
  
  console.log(date, "date");
  

  const data = await prisma.event.findMany({
    where: {
        startTime: {
            gte: new Date(date.setHours(0,0,0,0)),
            lte: new Date(date.setHours(23, 59, 59, 999))
        }
    }
  })


  console.log(data, "data");
  
  return (
    <div className="flex flex-col gap-4">
      {data && !data.length && <p className="text-sm text-gray-600 font-semibold">No Data</p>}
      {data.map((event) => (
        <div
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-purple"
          key={event.id}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600 text-md">
              {event.title}
            </h1>
            <span className="text-gray-300 text-xs">{event.startTime.toLocaleTimeString("en-UK", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            })}</span>
          </div>
          <p className="text-xs mt-2 text-gray-500">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
