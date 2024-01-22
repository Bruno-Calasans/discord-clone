"use client"
import { MemberWithProfile } from "@/types/MemberProfile"
import type { Profile } from "../../../prisma/output"
import MembersScrollArea from "./MembersScrollArea"

type MembersSideBarProps = {
  profile: Profile
  members: MemberWithProfile[]
}

export default function MembersSideBar({
  profile,
  members,
}: MembersSideBarProps) {
  return (
    <div className="h-full max-w-[300px] dark:bg-zinc-900 max-md:hidden">
      <div className="flex h-12 items-center justify-center">
        <div>Members</div>
      </div>
      <MembersScrollArea profile={profile} members={members} />
    </div>
  )
}
