"use client"
import type { MemberWithProfile } from "@/types/MemberProfile"
import type { Profile } from "../../../prisma/output"
import { ScrollArea } from "../ui/ScrollArea"
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
    (member) => member.profileId === profile.id
  )
  if (!profileMember) return null

  return (
    <div className="flex flex-col justify-between items-center">
      <ScrollArea className="flex flex-col justify-center items-center gap-3 w-full p-1">
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
      </ScrollArea>
    </div>
  )
}
