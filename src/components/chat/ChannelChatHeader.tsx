import { Hash } from "lucide-react"
import { Channel } from "../../../prisma/output"
import MobileMenuToggle from "./MobileMenuToggle"
import ConnectioIndicator from "./ConnectionIndicator"

type ChatHeaderProps = {
  channel: Channel
}

export default function ChannelChatHeader({ channel }: ChatHeaderProps) {
  return (
    <div className="flex gap-1 w-full items-center justify-between font-semibold text-md dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 px-2 transition">
      <div>
        <MobileMenuToggle serverId={channel.serverId} />
        <div className="flex gap-2 items-center">
          <p className="flex gap-1 items-center capitalize">
            <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            {channel.name}
          </p>
        </div>
      </div>
      <ConnectioIndicator />
    </div>
  )
}