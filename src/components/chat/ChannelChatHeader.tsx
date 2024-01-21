import { Hash } from "lucide-react";
import { Channel } from "../../../prisma/output";
import MobileMenuToggle from "./MobileMenuToggle";
import ConnectioIndicator from "./ConnectionIndicator";

type ChatHeaderProps = {
  channel: Channel;
};

export default function ChannelChatHeader({ channel }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 w-full items-center justify-between gap-1 border-b-2 px-2 font-semibold transition dark:border-neutral-800 dark:bg-zinc-900">
      <div>
        <MobileMenuToggle serverId={channel.serverId} />
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1">
            <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            {channel.name}
          </p>
        </div>
      </div>
      <ConnectioIndicator />
    </div>
  );
}
