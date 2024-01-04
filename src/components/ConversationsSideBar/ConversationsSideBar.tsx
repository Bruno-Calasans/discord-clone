"use client"
import { cn } from "@/utils/cn"
import Separator from "@/components/ui/Separator"
import ServersAction from "./ServersAction"
import NavigationFooter from "@/components/NavigationSideBar/NavigationFooter"
import ConversationScrollBar from "./ConversationsScrollBar"
import type { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import type { Profile } from "../../../prisma/output"
import { useParams } from "next/navigation"
import FriendsActions from "./FriendsActions"

type ConversationsSideBarProps = {
  conversations: ConversationWithProfiles[]
  profile: Profile
}

export default function ConversationsSideBar({
  conversations,
  profile,
}: ConversationsSideBarProps) {
  const params = useParams()
  const selectedConversation = params.conversationId as string | undefined

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-100 p-2 dark:bg-zinc-900 items-center space-y-3 h-full overflow-hidden border-r-[1.5px] w-[200px] transition max-md:hidden"
      )}
    >
      <div className="w-full flex flex-col justify-around gap-3 p-1">
        <ServersAction />
        <FriendsActions />
      </div>

      <Separator className="bg-slate-600 w-full" />
      <ConversationScrollBar
        conversations={conversations}
        profile={profile}
        selectedConversation={selectedConversation}
      />
      <NavigationFooter classname="flex-row justify-around w-full" />
    </aside>
  )
}
