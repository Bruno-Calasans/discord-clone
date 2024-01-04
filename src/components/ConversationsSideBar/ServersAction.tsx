"use client"
import { Boxes } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ServersAction() {
  const router = useRouter()

  const clickHandler = () => {
    router.push("/servers")
  }

  return (
    <div
      onClick={clickHandler}
      className="group  hover:bg-emerald-500 hover:dark:bg-emerald-500 rounded-sm transition"
    >
      <button className="flex items-center gap-2 p-2  h-full w-full">
        <Boxes
          size={25}
          className="text-emerald-500 group-hover:text-white transition"
        />
        <p>Servers</p>
      </button>
    </div>
  )
}
