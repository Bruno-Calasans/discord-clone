"use client"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import ServerCategory from "./ServerCategory"
import { Member } from "../../../prisma/output"
import useModal from "@/hooks/useModal/useModal"

type ServerSectionProps = {
  server: ServerWithMembersAndProfile
  member: Member
}

export default function ServerSection({ server, member }: ServerSectionProps) {
  const { open } = useModal()

  const textChannels = server.channels.filter(
    (channel) => channel.type === "TEXT"
  )

  const audioChannels = server.channels.filter(
    (channel) => channel.type === "AUDIO"
  )

  const videoChannels = server.channels.filter(
    (channel) => channel.type === "VIDEO"
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

  return (
    <div className="flex flex-col gap-2 p-2 mt-1">
      {textChannels.length > 0 && (
        <ServerCategory
          label="Text Channels"
          member={member}
          channels={textChannels}
          server={server}
          onCreateChannel={createTextChannelHandler}
        />
      )}

      {audioChannels.length > 0 && (
        <ServerCategory
          label="Audio Channels"
          member={member}
          channels={audioChannels}
          server={server}
          onCreateChannel={createAudioChannelHandler}
        />
      )}

      {videoChannels.length > 0 && (
        <ServerCategory
          label="Video Channels"
          member={member}
          channels={videoChannels}
          server={server}
          onCreateChannel={createVideoChannelHandler}
        />
      )}
    </div>
  )
}
