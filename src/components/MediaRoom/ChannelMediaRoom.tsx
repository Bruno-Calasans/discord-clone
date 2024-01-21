/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import "@livekit/components-styles"
import { useEffect, useState } from "react"
import { Channel } from "../../../prisma/output"
import { generateChannelToken } from "@/actions/livekitActions"
import { Loader2 } from "lucide-react"
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react"
import { MemberWithProfile } from "@/types/MemberProfile"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import ChannelAudioConference from "./ChannelAudioConference"

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
  const [token, setToken] = useState<string | null>(null)
  const isAudio = withAudio && !withVideo
  const isVideo = (withAudio && withVideo) || (!withAudio && withVideo)

  const loadToken = async () => {
    const generatedToken = await generateChannelToken({
      serverId: server.id,
      memberId: member.id,
      channelId: channel.id,
    })

    if (!generatedToken) return
    setToken(generatedToken)
  }

  useEffect(() => {
    if (!token) {
      loadToken()
    }
  }, [server.id, member.id, channel.id])

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
      className="flex"
    >
      {isAudio && (
        <ChannelAudioConference
          currentMember={member}
          server={server}
          channel={channel}
        />
      )}
      {isVideo && <VideoConference />}
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
