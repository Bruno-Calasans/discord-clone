/* eslint-disable react-hooks/exhaustive-deps */
import useSocket from "@/hooks/useSocket/useSocket"
import {
  TrackReference,
  VideoTrack,
  useParticipantContext,
} from "@livekit/components-react"
import type { Participant } from "livekit-client"
import { Eye, Maximize2, Monitor, X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard"
import { SocketFn } from "@/types/Socket"

type ScreenShareViewProps = {
  track: TrackReference
}

export default function ScreenShareView({ track }: ScreenShareViewProps) {
  const { socket } = useSocket()
  const currentParticipant = useParticipantContext()
  const [viewers, setViewers] = useState<Participant[]>([])

  const participant = track.participant
  const { identity, isLocal, isScreenShareEnabled } = participant
  const isViewer = currentParticipant
    ? viewers.map((w) => w.identity).includes(currentParticipant.identity)
    : false
  const canIRender = (isScreenShareEnabled && isLocal) || isViewer
  const isYourScreen = participant.identity === currentParticipant.identity

  const stopWatchHandler = () => {
    socket?.emit("screen-share:leave", {
      viewer: currentParticipant,
      transmitter: participant,
    })
  }

  const addviewer = (participant: Participant) => {
    setViewers((curr) => [...curr, participant])
  }

  const removeViewer = (participant: Participant) => {
    setViewers((currViewers) => {
      return currViewers.filter((w) => w.identity !== participant.identity)
    })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!socket) return

    const addViewerHandler: SocketFn = ({ viewer, transmitter }) => {
      if (!viewer || !transmitter) return
      const IsSameTransmitter = participant.identity === transmitter.identity
      // const isViewingYourself =
      //   viewer.identity === transmitter.identity ||
      //   viewer.identity === participant.identity

      if (!IsSameTransmitter) {
        return
      }
      console.log("member", currentParticipant.identity)
      console.log("view", viewer.identity)
      console.log("transmitter", transmitter.identity)
      addviewer(viewer)
    }

    const removeViewerHandler: SocketFn = ({ viewer, transmitter }) => {
      if (!viewer || !transmitter) return
      removeViewer(viewer)
    }

    socket.on("screen-share:join", addViewerHandler)
    socket.on("screen-share:leave", removeViewerHandler)

    return () => {
      socket.removeListener("screen-share:join", addViewerHandler)
      socket.removeListener("screen-share:leave", removeViewerHandler)
    }
  }, [socket?.id])

  console.log(viewers)
  if (!canIRender) return null

  return (
    <div className="group relative flex flex-1">
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
            <span>{viewers.length}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="z-50 w-fit">
          <div className="text-xm flex flex-col">
            <p>{viewers.length} viewer(s)</p>
            <div className="text-zinc-400">
              {viewers.map((w) => (
                <div key={w.sid}>{w.identity}</div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      {/* Leave Transmission */}
      {!isLocal && (
        <button
          onClick={stopWatchHandler}
          className="invisible absolute left-1 top-1 z-50 flex cursor-pointer items-center justify-center gap-1 rounded-sm bg-zinc-800 px-2 py-1 text-lg font-bold group-hover:visible"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Resize Button */}
      <button
        onClick={stopWatchHandler}
        className="invisible absolute right-1 top-1 z-50 flex cursor-pointer items-center justify-center gap-1 rounded-sm bg-zinc-800 p-1 text-lg group-hover:visible"
      >
        <Maximize2 className="h-4 w-4" />
      </button>

      <VideoTrack className="" trackRef={track} />
    </div>
  )
}
