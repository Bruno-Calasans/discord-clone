import type { DirectMessage, Profile } from "../../prisma/output"
import type { ConversationWithProfiles } from "./ConversationWithProfiles"

export type DmWithProfileConversation = DirectMessage & {
  profile: Profile
  conversation: ConversationWithProfiles
}
