import { MemberWithProfile } from "@/types/MemberProfile"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
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
import { Channel } from "../../../prisma/output"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"
import JoinRoom from "./JoinRoom"
import ParticipantView from "./ParticipantView"
import { Participant, Track, TrackPublication } from "livekit-client"
import ScreenShareView from "./ScreenShareView"
import { useEffect } from "react"
import useTransmission from "@/hooks/useTransmission/useTransmission"

type ChannelAudioConferenceProps = {
  currentMember: MemberWithProfile
  server: ServerWithMembersAndProfile
  channel: Channel
}

export default function ChannelAudioConference({
  currentMember,
  server,
  channel,
}: ChannelAudioConferenceProps) {
  const room = useRoomContext()
  const { startTransmission } = useTransmission()
  const connection = useConnectionState(room)
  const participants = useParticipants()
  const screenTracksRef = useTracks([Track.Source.ScreenShare])
  const { localParticipant } = useLocalParticipant()
  const membersNum = participants.length

  const createMemberMap = () => {
    const membersMap = {} as Record<string, MemberWithProfile>
    const memberNames = participants.map((p) => p.identity)
    server.members.forEach((member) => {
      if (memberNames.includes(member.name)) {
        membersMap[member.name] = member
      }
    })
    return membersMap
  }
  const membersMap = createMemberMap()

  useEffect(() => {
    const startScreenSharingHandler = (
      track: TrackPublication,
      participant: Participant,
    ) => {
      if (track.source === Track.Source.ScreenShare) {
        startTransmission(participant)
      }
    }

    // room.on("disconnected", disconnectCallHandler)
    // room.on("participantDisconnected", disconnectCallHandler)
    room.on("trackPublished", startScreenSharingHandler)
    room.on("localTrackPublished", startScreenSharingHandler)

    return () => {
      // room.removeListener("disconnected", disconnectCallHandler)
      // room.removeListener("participantDisconnected", disconnectCallHandler)
      room.removeListener("trackPublished", startScreenSharingHandler)
      room.removeListener("localTrackPublished", startScreenSharingHandler)
    }
  }, [channel.id])

  if (connection === "disconnected") {
    return (
      <JoinRoom
        label="Join audio channel"
        server={server}
        channel={channel}
        currentMember={currentMember}
      />
    )
  }

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
    <div className="flex flex-1 flex-col gap-2 p-5">
      <div className="flex flex-1 flex-col gap-4">
        {/* Screen share container */}
        <div className="flex">
          <ParticipantContext.Provider value={localParticipant}>
            {screenTracksRef.map((track) => (
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
        <div
          className={cn(
            "flex flex-1 flex-col gap-2",
            membersNum === 2 || (membersNum === 3 && "grid grid-rows-2 gap-2"),
            membersNum === 3 && `grid grid-cols-2 grid-rows-2 gap-2`,
          )}
        >
          <ParticipantContext.Provider value={localParticipant}>
            {participants.map((participant) => (
              <ParticipantView
                key={participant.sid}
                participant={participant}
                member={membersMap[participant.identity]}
              />
            ))}
          </ParticipantContext.Provider>
        </div>
      </div>

      <ControlBar
        variation="minimal"
        controls={{
          camera: false,
          screenShare: true,
        }}
      />
    </div>
  )
}
