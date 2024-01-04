"use client"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { useRouter } from "next/navigation"
import { Conversation, Profile } from "../../../prisma/output"
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
  selectedConversation,
}: ConversationScrollBarProps) {
  const router = useRouter()
  const clickConversationHandler = async (conversation: Conversation) => {
    router.push(`/conversations/${conversation.id}`)
  }

  return (
    <div className="flex flex-col h-full w-full px-2">
      <div className="w-full flex justify-between mb-2 text-sm text-zinc-400">
        <p className="font-bold">Direct messages</p>
        <button>+</button>
      </div>
      {conversations.length > 0 && (
        <ScrollArea className="flex flex-col justify-center items-center gap-2">
          {conversations.length > 0 &&
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selectedConversation}
                onClick={() => clickConversationHandler(conversation)}
                profile={profile}
              />
            ))}
        </ScrollArea>
      )}
    </div>
  )
}
