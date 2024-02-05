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
      className="group rounded-sm font-semibold transition hover:bg-emerald-500 hover:text-white hover:dark:bg-emerald-500"
    >
      <button className="flex h-full w-full items-center  gap-2 p-2">
        <Boxes
          size={25}
          className="text-emerald-500 transition group-hover:text-white"
        />
        <p>Servers</p>
      </button>
    </div>
  )
}
