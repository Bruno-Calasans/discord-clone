import { Profile } from "../../../prisma/output"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import DmMobileMenuToggle from "./DmMobileMenuToggle"
import DmChatHeaderContent from "./DmChatHeaderContent"

type ChatHeaderProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function DMChatHeader({
  conversation,
  currentProfile,
  otherProfile,
}: ChatHeaderProps) {
  return (
    <div className="relative flex border-b-2 px-2 py-2 dark:border-neutral-800 dark:bg-zinc-900">
      <DmMobileMenuToggle />
      <DmChatHeaderContent
        conversation={conversation}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
      />
    </div>
  )
}
