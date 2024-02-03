/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import {
  ControlBar,
  ParticipantContext,
  TrackRefContext,
  useConnectionState,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react"
import { Profile } from "../../../prisma/output"
import { Loader2 } from "lucide-react"
import { Participant, Track, TrackPublication } from "livekit-client"
import ScreenShareView from "./ScreenShareView"
import DmParticipantView from "./DmParticipantView"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import useDetectDevices from "@/hooks/useDetectDevices"
import { useEffect } from "react"
import useCall from "@/hooks/useCall/useCall"
import useTransmission from "@/hooks/useTransmission/useTransmission"

type DmCallConference = {
  currentProfile: Profile
  otherProfile: Profile
  conversation: ConversationWithProfiles
}

export default function DmCallConference({
  currentProfile,
  otherProfile,
  conversation,
}: DmCallConference) {
  const { devices } = useDetectDevices()
  const { leaveCall } = useCall()
  const { startTransmission } = useTransmission()
  const room = useRoomContext()
  const connection = useConnectionState(room)
  const screenShareTracks = useTracks([Track.Source.ScreenShare])
  const currentParticipant = useLocalParticipant().localParticipant
  const participants = useParticipants()

  useEffect(() => {
    const disconnectCallHandler = () => {
      leaveCall(conversation)
    }

    const startScreenSharingHandler = (
      track: TrackPublication,
      participant: Participant,
    ) => {
      if (track.source === Track.Source.ScreenShare) {
        startTransmission(participant)
      }
    }

    room.on("disconnected", disconnectCallHandler)
    room.on("participantDisconnected", disconnectCallHandler)
    room.on("trackPublished", startScreenSharingHandler)
    room.on("localTrackPublished", startScreenSharingHandler)

    return () => {
      room.removeListener("disconnected", disconnectCallHandler)
      room.removeListener("participantDisconnected", disconnectCallHandler)
      room.removeListener("trackPublished", startScreenSharingHandler)
      room.removeListener("localTrackPublished", startScreenSharingHandler)
    }
  }, [conversation.id])

  if (connection === "connecting") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Connecting...</p>
      </div>
    )
  }

  if (connection === "reconnecting") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Reconnecting...</p>
      </div>
    )
  }

  return (
    <div className="absolute top-0 z-20 flex h-fit w-full flex-1 flex-col gap-2 bg-zinc-900 p-5">
      <div className="flex flex-1 flex-col justify-center gap-4">
        {/* Screen share and video container */}
        <div className="flex">
          <ParticipantContext.Provider value={currentParticipant}>
            {screenShareTracks.map((track) => (
              <TrackRefContext.Provider
                key={track.participant.sid}
                value={track}
              >
                <ScreenShareView />
              </TrackRefContext.Provider>
            ))}
          </ParticipantContext.Provider>
        </div>

        {/* Participants container */}
        <ParticipantContext.Provider value={currentParticipant}>
          <div className="flex justify-center gap-2">
            {participants.map((participant) => (
              <DmParticipantView
                key={participant.identity}
                participant={participant}
                profile={
                  participant.identity === currentProfile.username
                    ? currentProfile
                    : otherProfile
                }
              />
            ))}
          </div>
        </ParticipantContext.Provider>
      </div>

      <ControlBar
        variation="minimal"
        controls={{
          camera: devices.camera,
          screenShare: devices.microphone,
        }}
      />
    </div>
  )
}
