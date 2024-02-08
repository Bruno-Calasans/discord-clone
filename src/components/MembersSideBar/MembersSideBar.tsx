"use client"
import { MemberWithProfile } from "@/types/MemberProfile"
import type { Profile } from "../../../prisma/output"
import MembersScrollArea from "./MembersScrollArea"
import useHide from "@/hooks/useHide/useHide"

type MembersSideBarProps = {
  profile: Profile
  members: MemberWithProfile[]
}

export default function MembersSideBar({
  profile,
  members,
}: MembersSideBarProps) {
  const { serverMembers } = useHide()

  if (!serverMembers) return null

  return (
    <div className="h-full max-w-[300px] dark:bg-zinc-900 max-md:hidden">
      {/* <div className="flex h-12 items-center justify-center"></div> */}
      <MembersScrollArea profile={profile} members={members} />
    </div>
  )
}
