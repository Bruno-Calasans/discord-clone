"use client"
import { cn } from "@/utils/cn"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { useParams, useRouter } from "next/navigation"

type NavigationItemProps = {
  profile: Profile
  conversation: ConversationWithProfiles
}

export default function ConversationItem({
  profile,
  conversation,
}: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  const clickMemberHandler = () => {
    router.push(`/conversations/${conversation.id}`)
  }

  const conversationId = params.conversationId as string | undefined
  const selected = conversation.id === conversationId

  const { senderProfileId, senderProfile, receiverProfile } = conversation
  let conversationProfile = profile
  conversationProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return (
    <div
      className={cn(
        "group flex gap-2 items-center font-semibold text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 dark:text-zinc-400  hover:dark:text-zinc-200 hover:dark:bg-zinc-700  cursor-pointer p-[4px] rounded-sm transition",
        selected &&
          "text-zinc-200 bg-zinc-700 dark:bg-zinc-700 dark:text-zinc-200 pointer-events-none"
      )}
      onClick={clickMemberHandler}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={conversationProfile.imgUrl} />
      </Avatar>
      <p className="line-clamp-1">{conversationProfile.username}</p>
    </div>
  )
}
