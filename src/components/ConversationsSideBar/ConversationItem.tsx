"use client"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"
import { cn } from "@/utils/cn"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Profile } from "../../../prisma/output"

type NavigationItemProps = {
  profile: Profile
  conversation: ConversationWithProfiles
  selected?: boolean
  onClick: (id: string) => void
}

export default function ConversationItem({
  profile,
  conversation,
  selected,
  onClick,
}: NavigationItemProps) {
  const clickHandler = () => {
    onClick(conversation.id)
  }

  const { senderProfileId, senderProfile, receiverProfile } = conversation
  let conversationProfile = profile
  conversationProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return (
    <ActionTooltip label={"some label"} align="center" side="right">
      <button
        className="flex relative"
        key={conversation.id}
        onClick={clickHandler}
      >
        <div
          className={cn(
            "absolute left-0 top-0 w-[3px] rounded-r-sm bg-slate-600 dark:bg-white transition-all h-full",
            !selected && "h-[4px] top-[50%]"
          )}
        ></div>

        <div className="relative w-10 h-10 ml-2">
          <Image
            src={conversationProfile.imgUrl}
            className="rounded-full hover:rounded-[16px] transition-all"
            alt={conversationProfile.username}
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  )
}
