"use client"
import { MemberWithProfile } from "@/types/MemberProfile"
import { Member, Profile } from "../../../prisma/output"
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
    <div className="dark:bg-zinc-900 max-w-[300px] h-full">
      <div className="flex justify-center items-center h-12">
        <div>Members</div>
      </div>
      <MembersScrollArea profile={profile} members={members} />
    </div>
  )
}