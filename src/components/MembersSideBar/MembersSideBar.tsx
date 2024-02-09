"use client"

import { MemberWithProfile } from "@/types/MemberProfile"
import MembersScrollArea from "./MembersScrollArea"
import useHide from "@/hooks/useHide/useHide"

type MembersSideBarProps = {
  currentMember: MemberWithProfile
  members: MemberWithProfile[]
}

export default function MembersSideBar({
  currentMember,
  members,
}: MembersSideBarProps) {
  const { serverMembers } = useHide()
  if (!serverMembers) return null

  return (
    <div className="h-full max-w-[300px] dark:bg-zinc-900 max-md:hidden">
      <MembersScrollArea currentMember={currentMember} members={members} />
    </div>
  )
}
