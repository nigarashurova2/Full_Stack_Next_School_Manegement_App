"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TableSearch = () => {
  const [value, setValue] = useState<string>('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const params = new URLSearchParams(window.location.search)
    if(value) params.set('search', value)
    else params.delete('search')
    router.push(`${window.location.pathname}?${params}`)
  }
  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="text"
        value={value}
        onChange={(e)=> setValue(e.target.value)}
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
