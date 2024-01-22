import type { Conversation, Profile } from "../../prisma/output"

export type ConversationWithProfiles = Conversation & {
  senderProfile: Profile
  receiverProfile: Profile
}
