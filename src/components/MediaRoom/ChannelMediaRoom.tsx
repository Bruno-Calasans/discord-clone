/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import "@livekit/components-styles"
import { Channel } from "../../../prisma/output"
import { Loader2 } from "lucide-react"
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react"
import { MemberWithProfile } from "@/types/MemberProfile"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import ChannelAudioConference from "./ChannelAudioConference"
import ChannelVideoConference from "./ChannelVideoConference"
import useMidiaToken from "@/hooks/useMidiaToken"

type MediaRoomProps = {
  server: ServerWithMembersAndProfile
  member: MemberWithProfile
  channel: Channel
  withVideo?: boolean
  withAudio?: boolean
}

export default function ChannelMediaRoom({
  server,
  member,
  channel,
  withVideo,
  withAudio,
}: MediaRoomProps) {
  const { token } = useMidiaToken({
    type: "channel",
    channelId: channel.id,
    memberId: member.id,
    serverId: server.id,
  })
  const isAudio = withAudio && !withVideo
  const isVideo = (withAudio && withVideo) || (!withAudio && withVideo)

  if (!token) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={withVideo}
      audio={withAudio}
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="flex flex-1"
    >
      {isAudio && (
        <ChannelAudioConference
          currentMember={member}
          server={server}
          channel={channel}
        />
      )}
      {isVideo && (
        <ChannelVideoConference
          currentMember={member}
          server={server}
          channel={channel}
        />
      )}
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
