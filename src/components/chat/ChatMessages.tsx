import type { MemberWithProfile } from "@/types/MemberProfile"
import type { Channel, Message } from "../../../prisma/output"
import ChatWelcome from "./ChatWelcome"

type ChatMessagesProps = {
  channel: Channel
  member: MemberWithProfile
  messages: Message[]
}

export default function ChatMessages({
  channel,
  member,
  messages,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 flex-col">
      {messages.length === 0 && <ChatWelcome channel={channel} />}
    </div>
  )
}
