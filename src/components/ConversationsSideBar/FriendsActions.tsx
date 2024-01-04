"use client"
import ActionTooltip from "@/components/custom/ActionTooltip"
import { UsersRound } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FriendsActions() {
  const router = useRouter()

  const clickHandler = () => {
    router.push("/conversations/friends")
  }

  return (
    <div
      onClick={clickHandler}
      className="group  hover:bg-emerald-500 hover:dark:bg-emerald-500 rounded-sm transition"
    >
      <button className="flex items-center gap-2 h-full w-full p-2">
        <UsersRound
          size={25}
          className="text-emerald-500 group-hover:text-white transition"
        />
        <p>Friends</p>
      </button>
    </div>
  )
}
