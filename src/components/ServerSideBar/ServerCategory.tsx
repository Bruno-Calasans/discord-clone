/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useParams } from "next/navigation"
import { CHANNEL_TYPE, type Channel } from "../../../prisma/output"
import ActionTooltip from "../custom/ActionTooltip"
import {
  Edit,
  Hash,
  Mic,
  MoreVertical,
  Plus,
  Trash,
  Video,
  Volume,
  Volume2,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import useChannel from "@/hooks/useChannel"
import { useEffect } from "react"
import { MemberWithProfile } from "@/types/MemberProfile"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

const channelIconMap = {
  [CHANNEL_TYPE.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [CHANNEL_TYPE.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [CHANNEL_TYPE.VIDEO]: <Video className="mr-2 h-4 w-4" />,
} as const

type ServerCategoryProps = {
  label: React.ReactNode
  member: MemberWithProfile
  channels: Channel[]
  server: ServerWithMembersAndProfile
  onClickChannel: (channel: Channel) => void
  onCreateChannel: () => void
  onEditChannel: (channel: Channel) => void
  onDeleteChannel: (channel: Channel) => void
}

export default function ServerCategory({
  label,
  member,
  channels,
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  onClickChannel,
}: ServerCategoryProps) {
  const { socket, data, getChannel, getChannelMembers, getMemberInChannel } =
    useChannel()
  const params = useParams()
  let selectedChannel = params?.channelId as string

  const actionHandler = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation()
    onEditChannel(channel)
    onDeleteChannel(channel)
  }

  const clickChannelHandler = (channel: Channel) => {
    const previousChannel = channels.find((c) => c.id === selectedChannel)
    socket?.emit("channel:leave", { channel: previousChannel, member })
    onClickChannel(channel)
  }

  useEffect(() => {
    if (!selectedChannel || !socket) return

    const channel = channels.find((channel) => channel.id === selectedChannel)
    if (!channel) return

    const isInChannel = getMemberInChannel(member.id, channel.id)
    if (isInChannel) return

    socket.emit("channel:join", { channel, member })
  }, [socket, member.id, selectedChannel])

  return (
    <div>
      {/* Header */}
      <div className="mt-3 flex items-center justify-between overflow-hidden text-xs font-semibold uppercase">
        <p className="line-clamp-1">{label}</p>
        {member.role.toLowerCase() === "admin" && (
          <ActionTooltip label="Create Channel">
            <button
              onClick={onCreateChannel}
              className="ml-1 text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-500 hover:dark:text-zinc-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      </div>

      {/* channels */}
      <div className="item ml-1 mt-2 flex flex-col gap-1 overflow-hidden text-sm  font-semibold">
        {channels.map((channel) => (
          <div key={channel.id}>
            <div
              onClick={() => clickChannelHandler(channel)}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-sm p-[6px] text-zinc-600  transition hover:bg-zinc-700 hover:text-zinc-100 dark:text-zinc-400 hover:dark:text-zinc-200",
                selectedChannel === channel.id &&
                  "bg-zinc-600 text-white dark:bg-zinc-700 dark:text-zinc-200",
              )}
            >
              {/* Channel */}
              <div className="flex items-center">
                {channelIconMap[channel.type]}
                <p className="line-clamp-1">{channel.name}</p>
              </div>

              {/* Channel Options */}
              {member.role.toLowerCase() === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      selectedChannel !== channel.id &&
                        "invisible group-hover:visible",
                    )}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    alignOffset={-4}
                    sideOffset={-2}
                  >
                    <DropdownMenuItem
                      onClick={(e) => actionHandler(e, channel)}
                    >
                      <div className="flex">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </div>
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuItem
                      onClick={(e) => actionHandler(e, channel)}
                    >
                      <div className="flex text-rose-500">
                        <Trash className="mr-1 h-4 w-4 " />
                        Delete
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* members on midia channel */}
            {/* {[CHANNEL_TYPE.AUDIO, CHANNEL_TYPE.VIDEO].includes(
              getChannel(channel.id)?.type,
            ) && (
              <div className="ml-3 mt-2 flex flex-col gap-2">
                {getChannelMembers(channel.id)?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1 overflow-hidden"
                  >
                    <Avatar className="rounded-full">
                      <AvatarImage
                        className="h-6 w-6 rounded-full"
                        src={member.profile.imgUrl}
                      />
                    </Avatar>
                    <span className="text-ellipsis">{member.name}</span>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  )
}
