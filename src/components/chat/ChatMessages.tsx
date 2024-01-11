"use client"
import type { MemberWithProfile } from "@/types/MemberProfile"
import type { Channel } from "../../../prisma/output"
import ChatWelcome from "./ChatWelcome"
import useChannelMsgQuery from "@/hooks/useChannelMsgQuery"
import { Loader2, ServerCrash } from "lucide-react"
import ChannelMessage from "./ChannelMessage"
import { ScrollArea } from "@/components/ui/ScrollArea"
import React from "react"

type ChatMessagesProps = {
  channel: Channel
  member: MemberWithProfile
}

export default function ChatMessages({ channel, member }: ChatMessagesProps) {
  const { data, isLoading, isError } = useChannelMsgQuery({
    channelId: channel.id,
    batch: 10,
  })
  const messages = data?.pages[0]?.messages

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 gap-1 justify-center items-center">
        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
        <p className="text-zinc-500">Loading Messages...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col flex-1 gap-1 justify-center items-center">
        <ServerCrash className="h-6 w-6 text-zinc-500" />
        <p className="text-zinc-500">Something went wrong :(</p>
      </div>
    )
  }

  // console.log(data)
  return (
    <ScrollArea className="flex flex-col px-2 pb-6">
      <ChatWelcome channel={channel} />
      {messages && messages.length > 0 && (
        <div className="flex flex-col-reverse gap-2 border-none">
          {messages.map((message) => (
            <ChannelMessage
              key={message.id}
              member={member}
              message={message}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
