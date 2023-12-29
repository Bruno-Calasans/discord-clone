"use client"
import { useParams } from "next/navigation"
import { CHANNEL_TYPE, type Channel, type Member } from "../../../prisma/output"
import ActionTooltip from "../custom/ActionTooltip"
import { Hash, Mic, Plus, Settings, Video } from "lucide-react"
import { cn } from "@/utils/cn"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import useModal from "@/hooks/useModal/useModal"

const channelIconMap = {
  [CHANNEL_TYPE.TEXT]: <Hash className="w-4 h-4 mr-1" />,
  [CHANNEL_TYPE.AUDIO]: <Mic className="w-4 h-4 mr-1" />,
  [CHANNEL_TYPE.VIDEO]: <Video className="w-4 h-4 mr-1" />,
} as const

type ServerCategoryProps = {
  label: React.ReactNode
  member: Member
  channels: Channel[]
  server: ServerWithMembersAndProfile
  onCreateChannel: () => void
}

export default function ServerCategory({
  label,
  member,
  channels,
  onCreateChannel,
}: ServerCategoryProps) {
  const params = useParams()
  let selectedChannel = params.channelId as string


  return (
    <div>
      {/* Header */}
      <div className="font-semibold text-xs uppercase flex justify-between items-center mt-3 overflow-hidden">
        <p className="line-clamp-1">{label}</p>
        {member.role.toLowerCase() === "admin" && (
          <ActionTooltip label="Create Channel">
            <button
              onClick={onCreateChannel}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-500 hover:dark:text-zinc-300 ml-1 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      </div>

      {/* channels */}
      <div className="font-semibold text-sm flex flex-col gap-1 ml-1 mt-2 item  overflow-hidden">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "group flex justify-between items-center p-[6px] hover:bg-zinc-700 text-zinc-600 hover:text-zinc-100  dark:text-zinc-400 hover:dark:text-zinc-200 rounded-sm transition cursor-pointer",
              selectedChannel === channel.id &&
                "bg-zinc-600 text-white dark:bg-zinc-700 dark:text-zinc-200"
            )}
          >
            <div className="flex items-center">
              {channelIconMap[channel.type]}
              <p className="line-clamp-1">{channel.name}</p>
            </div>

            {member.role.toLowerCase() === "admin" && (
              <ActionTooltip label="Edit Channel">
                <button
                  className={cn(
                    "text-zinc-400 hover:text-zinc-300 dark:text-zinc-500 hover:dark:text-zinc-300 transition ml-1",
                    selectedChannel !== channel.id && "hidden group-hover:flex"
                  )}
                >
                  <Settings className="h-4 w-4" />
                </button>
              </ActionTooltip>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
