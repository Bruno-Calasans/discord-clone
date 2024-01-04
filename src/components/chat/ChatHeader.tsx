import { Hash } from "lucide-react"
import { Channel } from "../../../prisma/output"

type ChatHeaderProps = {
  channel: Channel
  type: "channel" | "conversation"
}

export default function ChatHeader({ channel, type }: ChatHeaderProps) {
  return (
    <div className="">
      <div className="flex gap-2 items-center">
        <p className="flex gap-1 items-center capitalize">
          {type === "channel" && (
            <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          )}
          {channel.name}
        </p>
      </div>
    </div>
  )
}
