"use client"
import { cn } from "@/utils/cn"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { useParams, useRouter } from "next/navigation"
import useLast from "@/hooks/useLast"
import UserAvatar from "../custom/UserAvatar"

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
  const { saveLastConversation } = useLast()

  const clickMemberHandler = () => {
    saveLastConversation(conversation.id)
    router.push(`/conversations/${conversation.id}`)
  }

  const conversationId = params?.conversationId as string | undefined
  const selected = conversation.id === conversationId

  const { senderProfileId, senderProfile, receiverProfile } = conversation
  let conversationProfile = profile
  conversationProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center  gap-2 rounded-sm p-1 font-semibold text-zinc-600 transition hover:bg-zinc-700 hover:text-zinc-200 dark:text-zinc-400 hover:dark:bg-zinc-700 hover:dark:text-zinc-200",
        selected &&
          "pointer-events-none bg-zinc-700 text-zinc-200 dark:bg-zinc-700 dark:text-zinc-200",
      )}
      onClick={clickMemberHandler}
    >
      <UserAvatar
        imageUrl={conversationProfile.imgUrl}
        alt={conversationProfile.username}
      />
      <p className="truncate text-sm">{conversationProfile.username}</p>
    </div>
  )
}
