const Announcements = () => {
  return (
    <div className="bg-white  p-4 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-skyLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium text-sm">Lorem ipsum dolor sit amet.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-xs mt-1 text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, exercitationem!</p>    
        </div>
        <div className="bg-purpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium text-sm">Lorem ipsum dolor sit amet.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-xs mt-1 text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, voluptas?</p>
        </div>
          <div className="bg-yellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium text-sm">Lorem ipsum dolor sit amet.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
            </div>
            <p className="text-xs mt-1 text-gray-400">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, dignissimos!</p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
