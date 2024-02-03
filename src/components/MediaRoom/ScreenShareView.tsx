/* eslint-disable react-hooks/exhaustive-deps */
import {
  TrackReference,
  VideoTrack,
  useParticipantContext,
  useTrackRefContext,
} from "@livekit/components-react"
import { Eye, Maximize2, Minimize2, Monitor, X } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard"
import useTransmission from "@/hooks/useTransmission/useTransmission"
import { useState } from "react"
import { cn } from "@/utils/cn"

export default function ScreenShareView() {
  const [resize, setResize] = useState(false)
  const { transmissions, getViewer, getStreamerViewers, leaveTransmission } =
    useTransmission()
  const currentParticipant = useParticipantContext()
  const trackRef = useTrackRefContext() as TrackReference
  const participant = trackRef.participant

  const { identity, isLocal, isScreenShareEnabled } = participant
  const viewers = getStreamerViewers(participant)
  const isViewer = getViewer(currentParticipant)
  const canIRender = (isScreenShareEnabled && isLocal) || isViewer
  const isYourScreen = participant.identity === currentParticipant.identity

  const resizeHandler = () => {
    setResize((curr) => !curr)
  }

  const leaveTransmissionHandler = () => {
    leaveTransmission(participant, currentParticipant)
  }

  console.log(transmissions)

  if (!canIRender) return null

  return (
    <div className={cn("group relative flex h-52 w-full", resize && "h-full")}>
      {/* transmitter's name */}
      <div className="invisible absolute bottom-1 left-1 z-50 flex items-center justify-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs font-bold group-hover:visible">
        <Monitor className=" h-4 w-4" />
        {isYourScreen ? (
          <span className=" text-emerald-500">Your screen</span>
        ) : (
          <span>{identity} screen</span>
        )}
      </div>

      {/* Viewers number */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="absolute bottom-1 right-1 z-50 flex items-center justify-center gap-1 rounded-md bg-zinc-800 px-2 py-1">
            <Eye className=" h-4 w-4" />
            <span>{viewers?.length ?? 0}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="z-50 w-fit">
          <div className="text-xm flex flex-col">
            <p>{viewers?.length ?? 0} viewer(s)</p>
            <div className="text-zinc-400">
              {viewers?.map((w) => <div key={w.sid}>{w.identity}</div>)}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Leave Transmission */}
      {!isLocal && (
        <button
          onClick={leaveTransmissionHandler}
          className="invisible absolute left-1 top-1 z-50 flex cursor-pointer items-center justify-center gap-1 rounded-sm bg-rose-500 px-2 py-1 text-lg font-bold group-hover:visible"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Resize Button */}
      <button
        onClick={resizeHandler}
        className="invisible absolute right-1 top-1 z-50 flex cursor-pointer items-center justify-center gap-1 rounded-sm bg-zinc-800 p-1 text-lg group-hover:visible"
      >
        {resize ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </button>

      <VideoTrack trackRef={trackRef} />
    </div>
  )
}
