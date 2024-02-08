import { Channel } from "../../../prisma/output"
import MobileMenuToggle from "./MobileMenuToggle"
import ConnectioIndicator from "./ConnectionIndicator"
import CHANNEL_ICON_MAP from "@/constants/channelIconMap"

type ChatHeaderProps = {
  channel: Channel
}

export default function ChannelChatHeader({ channel }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 w-full items-center justify-between gap-1 border-b-2 px-2 font-semibold transition dark:border-neutral-800 dark:bg-zinc-900">
      <div>
        <MobileMenuToggle serverId={channel.serverId} />
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1">
            {CHANNEL_ICON_MAP[channel.type]}
            {channel.name}
          </p>
        </div>
      </div>
      <ConnectioIndicator />
    </div>
  )
}
