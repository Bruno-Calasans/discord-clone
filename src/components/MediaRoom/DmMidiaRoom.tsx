/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import "@livekit/components-styles"
import { Loader2 } from "lucide-react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import useMidiaToken from "@/hooks/useMidiaToken"
import { Profile } from "../../../prisma/output"
import DmCallConference from "./DmCallConference"

type MediaRoomProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function DmMidiaRoom({
  conversation,
  currentProfile,
  otherProfile,
}: MediaRoomProps) {
  const { token } = useMidiaToken({
    type: "conversation",
    conversationId: conversation.id,
    profileId: currentProfile.id,
  })

  if (!token) {
    return (
      <div className=" flex flex-1 flex-col items-center justify-center gap-1 ">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video
      audio
      token={token}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      className="flex dark:bg-zinc-900"
    >
      <DmCallConference
        conversation={conversation}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
