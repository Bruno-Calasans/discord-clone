import { MemberWithProfile } from "@/types/MemberProfile"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import {
  ControlBar,
  ParticipantContext,
  TrackRefContext,
  useConnectionState,
  useLocalParticipant,
  useParticipants,
  useRemoteParticipants,
  useRoomContext,
  useTracks,
} from "@livekit/components-react"
import { Channel } from "../../../prisma/output"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"
import JoinRoom from "./JoinRoom"
import ParticipantView from "./ParticipantView"
import { Track } from "livekit-client"
import ScreenShareView from "./ScreenShareView"

type ChannelVideoConferenceProps = {
  currentMember: MemberWithProfile
  server: ServerWithMembersAndProfile
  channel: Channel
}

export default function ChannelVideoConference({
  currentMember,
  server,
  channel,
}: ChannelVideoConferenceProps) {
  const room = useRoomContext()
  const connection = useConnectionState(room)
  const participants = useParticipants()
  const remotes = useRemoteParticipants()
  const trackRef = useTracks([Track.Source.ScreenShare])
  const currentParticipant = useLocalParticipant().localParticipant
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

  if (connection === "disconnected") {
    return (
      <JoinRoom
        label="Join video channel"
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
          <ParticipantContext.Provider value={currentParticipant}>
            {trackRef.map((track) => (
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
          <div className="grid flex-1 grid-cols-4 grid-rows-4 gap-3">
            <div className="col-span-3 row-span-full flex flex-1 ">
              <ParticipantView
                participant={currentParticipant}
                member={membersMap[currentParticipant.identity]}
              />
            </div>
            <div
              className={cn(
                "flex flex-1 flex-col gap-2",
                membersNum === 2 ||
                  (membersNum === 3 && "grid grid-rows-2 gap-2"),
                membersNum === 3 && `grid grid-cols-2 grid-rows-2 gap-2`,
              )}
            >
              {remotes.map((participant) => (
                <ParticipantView
                  key={participant.sid}
                  participant={participant}
                  member={membersMap[participant.identity]}
                />
              ))}
            </div>
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
