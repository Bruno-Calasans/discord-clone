"use client"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { Profile } from "../../../prisma/output"
import ConversationItem from "@/components/ConversationsSideBar/ConversationItem"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"

type ConversationScrollBarProps = {
  conversations: ConversationWithProfiles[]
  selectedConversation?: string
  profile: Profile
}

export default function ConversationScrollBar({
  profile,
  conversations,
}: ConversationScrollBarProps) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mb-2 flex justify-between text-sm dark:text-zinc-400">
        <p className="font-bold">Direct messages</p>
        <button className="font-bold">+</button>
      </div>
      {conversations.length > 0 && (
        <div className="flex flex-1 flex-col gap-3 scrollbar-thin scrollbar-track-zinc-400 scrollbar-thumb-zinc-600 scrollbar-track-rounded-sm scrollbar-w-[4px] dark:scrollbar-track-zinc-700 dark:scrollbar-thumb-zinc-400">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              profile={profile}
            />
          ))}
        </div>
      )}
    </div>
  )
}
