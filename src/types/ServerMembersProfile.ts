import type { Server, Member, Profile } from "../../prisma/output"
import type { MemberWithProfile } from "./MemberProfile"

export type ServerWithMembersAndProfile = Server & {
  members: MemberWithProfile[]
} & {
  profile: Profile
}
