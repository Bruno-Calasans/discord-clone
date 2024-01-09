import { Message, Member, Profile } from "../../prisma/output"

export type MessageWithMemberProfile = Message & {
  member: Member & {
    profile: Profile
  }
}
