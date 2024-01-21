import type { Member, Profile } from "../../prisma/output";

export type MemberWithProfile = Member & { profile: Profile };
