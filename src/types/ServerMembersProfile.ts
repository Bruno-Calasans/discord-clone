import type { Server, Member, Profile, Channel } from "../../prisma/output";
import type { MemberWithProfile } from "./MemberProfile";

export type ServerWithMembersAndProfile = Server & {
  members: MemberWithProfile[];
} & {
  profile: Profile;
} & {
  channels: Channel[];
};
