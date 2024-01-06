import { Profile } from "../../../prisma/output"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"

type ChatHeaderProps = {
  profile: Profile
  conversation: ConversationWithProfiles
}

export default function DMChatHeader({
  profile,
  conversation,
}: ChatHeaderProps) {
  const { senderProfileId, senderProfile, receiverProfile } = conversation
  let conversationProfile = profile
  conversationProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return (
    <div className="flex w-full items-center gap-2  dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 p-3 transition">
      <Avatar className="w-8 h-8">
        <AvatarImage src={conversationProfile.imgUrl} />
      </Avatar>
      <p className="text-md capitalize font-semibold ">
        {conversationProfile.username}
      </p>
    </div>
  )
}
