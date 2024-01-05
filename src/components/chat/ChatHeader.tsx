import { Hash } from "lucide-react"
import { Channel } from "../../../prisma/output"
import MobileMenuToggle from "./MobileMenuToggle"

type ChatHeaderProps = {
  channel: Channel
  type: "channel" | "conversation"
}

export default function ChatHeader({ channel, type }: ChatHeaderProps) {
  return (
    <div className="flex gap-1 w-full items-center font-semibold text-md dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 px-2 transition">
      <MobileMenuToggle serverId={channel.serverId} />
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
