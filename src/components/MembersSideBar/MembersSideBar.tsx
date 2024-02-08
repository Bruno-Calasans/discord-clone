"use client"
import { MemberWithProfile } from "@/types/MemberProfile"
import type { Profile } from "../../../prisma/output"
import MembersScrollArea from "./MembersScrollArea"
import { UserRound } from "lucide-react"
import { useState } from "react"

type MembersSideBarProps = {
  profile: Profile
  members: MemberWithProfile[]
}

export default function MembersSideBar({
  profile,
  members,
}: MembersSideBarProps) {
  const [visible, setVisible] = useState(false)

  if (!visible)
    return (
      <button className="absolute right-2 top-2">
        <UserRound onClick={() => setVisible(true)} className="h4 w-4" />
      </button>
    )

  return (
    <div className="h-full max-w-[300px] dark:bg-zinc-900 max-md:hidden">
      {/* <div className="flex h-12 items-center justify-center"></div> */}
      <MembersScrollArea profile={profile} members={members} />
    </div>
  )
}
