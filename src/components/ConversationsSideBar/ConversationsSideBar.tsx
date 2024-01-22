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
  const selectedConversation = params?.conversationId as string | undefined

  return (
    <aside
      className={cn(
        "flex h-full w-[250px] flex-col items-center space-y-3 overflow-hidden text-ellipsis border-r-[1.5px] bg-slate-100  p-2 transition dark:bg-zinc-900 max-md:hidden",
      )}
    >
      <div className="flex w-full flex-col justify-around gap-3 p-1">
        <ServersAction />
        <FriendsActions />
      </div>

      <Separator className="w-full bg-slate-600" />
      <ConversationScrollBar
        conversations={conversations}
        profile={profile}
        selectedConversation={selectedConversation}
      />
      <NavigationFooter classname="flex-row justify-around w-full" />
    </aside>
  )
}
