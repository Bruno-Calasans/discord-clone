"use client"
import { MemberWithProfile } from "@/types/MemberProfile"
import { Member, Profile } from "../../../prisma/output"
import { ScrollArea } from "../ui/ScrollArea"
import MembersCategory from "./MembersCategory"
import uniqueArray from "@/utils/uniqueValues"

type MembersScrollAreaProps = {
  profile: Profile
  members: MemberWithProfile[]
  onClickMember: (member: Member) => void
}

export default function MembersScrollArea({
  profile,
  members,
  onClickMember,
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
  )!

  return (
    <div className="flex flex-col justify-between items-center">
      <ScrollArea className="flex flex-col justify-center items-center gap-3 w-full">
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
            onClickMember={onClickMember}
          />
        ))}
      </ScrollArea>
    </div>
  )
}
