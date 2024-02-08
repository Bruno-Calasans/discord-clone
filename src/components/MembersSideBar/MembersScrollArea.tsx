"use client"

import type { MemberWithProfile } from "@/types/MemberProfile"
import type { Profile } from "../../../prisma/output"
import MembersCategory from "./MembersCategory"
import uniqueArray from "@/utils/uniqueValues"

type MembersScrollAreaProps = {
  profile: Profile
  members: MemberWithProfile[]
}

export default function MembersScrollArea({
  profile,
  members,
}: MembersScrollAreaProps) {
  const groupMembersByRole = () => {
    const roles = members.map((member) => member.role)
    const groupRoles = uniqueArray(roles)
    const membersGroupByRole: Record<string, MemberWithProfile[]> = {}

    for (const role of groupRoles) {
      const roleMembers = members.filter((member) => member.role === role)
      membersGroupByRole[role] = roleMembers
    }

    return membersGroupByRole
  }

  const membersByRole = groupMembersByRole()

  const profileMember = members.find(
    (member) => member.profileId === profile.id,
  )
  if (!profileMember) return null

  return (
    <div className="flex h-full w-[200px] flex-1 flex-col gap-3 p-2 scrollbar-thin scrollbar-track-zinc-400 scrollbar-thumb-zinc-600 scrollbar-track-rounded-sm scrollbar-w-[4px] dark:scrollbar-track-zinc-700 dark:scrollbar-thumb-zinc-400">
      {Object.keys(membersByRole).map((role) => (
        <MembersCategory
          key={role}
          label={
            <div className="capitalize">
              {role} - {membersByRole[role].length}
            </div>
          }
          members={membersByRole[role]}
          profileMember={profileMember}
        />
      ))}
    </div>
  )
}
