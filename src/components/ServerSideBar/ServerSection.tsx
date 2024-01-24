"use client"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import ServerCategory from "./ServerCategory"
import { Channel } from "../../../prisma/output"
import useModal from "@/hooks/useModal/useModal"
import { useRouter } from "next/navigation"
import { MemberWithProfile } from "@/types/MemberProfile"

type ServerSectionProps = {
  server: ServerWithMembersAndProfile
  member: MemberWithProfile
}

export default function ServerSection({ server, member }: ServerSectionProps) {
  const router = useRouter()
  const { open } = useModal()

  const textChannels = server.channels.filter(
    (channel) => channel.type === "TEXT",
  )

  const audioChannels = server.channels.filter(
    (channel) => channel.type === "AUDIO",
  )

  const videoChannels = server.channels.filter(
    (channel) => channel.type === "VIDEO",
  )

  const createTextChannelHandler = () => {
    open("CreateChannel", { server, channelType: "TEXT" })
  }

  const createAudioChannelHandler = () => {
    open("CreateChannel", { server, channelType: "AUDIO" })
  }

  const createVideoChannelHandler = () => {
    open("CreateChannel", { server, channelType: "VIDEO" })
  }

  const editChannelHandler = (channel: Channel) => {
    open("EditChannel", { channel })
  }

  const deleteChannelHandler = (channel: Channel) => {
    open("DeleteChannel", { channel })
  }

  const clickChannelHandler = (channel: Channel) => {
    router.push(`/servers/${server.id}/channels/${channel.id}`)
  }

  return (
    <div className="mt-1 flex flex-1 flex-col gap-2 p-2">
      {textChannels.length > 0 && (
        <ServerCategory
          label="Text Channels"
          member={member}
          channels={textChannels}
          server={server}
          onCreateChannel={createTextChannelHandler}
          onEditChannel={editChannelHandler}
          onDeleteChannel={deleteChannelHandler}
          onClickChannel={clickChannelHandler}
        />
      )}

      {audioChannels.length > 0 && (
        <ServerCategory
          label="Audio Channels"
          member={member}
          channels={audioChannels}
          server={server}
          onCreateChannel={createAudioChannelHandler}
          onEditChannel={editChannelHandler}
          onDeleteChannel={deleteChannelHandler}
          onClickChannel={clickChannelHandler}
        />
      )}

      {videoChannels.length > 0 && (
        <ServerCategory
          label="Video Channels"
          member={member}
          channels={videoChannels}
          server={server}
          onCreateChannel={createVideoChannelHandler}
          onEditChannel={editChannelHandler}
          onDeleteChannel={deleteChannelHandler}
          onClickChannel={clickChannelHandler}
        />
      )}
    </div>
  )
}
