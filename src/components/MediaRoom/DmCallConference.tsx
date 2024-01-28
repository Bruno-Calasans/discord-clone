import {
  ControlBar,
  ParticipantContext,
  TrackRefContext,
  useConnectionState,
  useLocalParticipant,
  useRemoteParticipant,
  useRoomContext,
  useTracks,
} from "@livekit/components-react"
import { Profile } from "../../../prisma/output"
import { Loader2 } from "lucide-react"
import { Track } from "livekit-client"
import ScreenShareView from "./ScreenShareView"
import DmParticipantView from "./DmParticipantView"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"

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
  const room = useRoomContext()
  const connection = useConnectionState(room)
  const trackRef = useTracks([Track.Source.ScreenShare])
  const currentParticipant = useLocalParticipant().localParticipant
  const otherParticipant = useRemoteParticipant(otherProfile.id)!

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
        {/* Screen share and video container */}
        <div className="flex">
          <ParticipantContext.Provider value={currentParticipant}>
            {trackRef.map((track) => (
              <TrackRefContext.Provider
                key={track.participant.sid}
                value={track}
              >
                <ScreenShareView track={track} />
              </TrackRefContext.Provider>
            ))}
          </ParticipantContext.Provider>
        </div>

        {/* Participants container */}
        <ParticipantContext.Provider value={currentParticipant}>
          <div className="flex gap-2">
            <DmParticipantView
              participant={currentParticipant}
              profile={currentProfile}
            />
            <DmParticipantView
              participant={otherParticipant}
              profile={otherProfile}
            />
          </div>
        </ParticipantContext.Provider>
      </div>

      <ControlBar
        variation="minimal"
        controls={{
          camera: true,
          screenShare: true,
        }}
      />
    </div>
  )
}
