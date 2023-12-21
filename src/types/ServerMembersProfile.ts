import type { Server, Member, Profile } from "../../prisma/output"

export type ServerMembersProfile = Server & { members: Member[] } & {
  profile: Profile
}
