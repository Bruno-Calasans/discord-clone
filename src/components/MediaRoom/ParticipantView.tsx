/* eslint-disable react-hooks/exhaustive-deps */
import { cn } from "@/utils/cn"
import { useParticipantContext } from "@livekit/components-react"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Eye, MicOff, Monitor, X } from "lucide-react"
import useSocket from "@/hooks/useSocket/useSocket"
import { MemberWithProfile } from "@/types/MemberProfile"
import type { Participant } from "livekit-client"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { useEffect, useState } from "react"
import { SocketFn } from "@/types/Socket"

type ParticipantViewProps = {
  participant: Participant
  member: MemberWithProfile
}

export default function ParticipantView({
  participant,
  member,
}: ParticipantViewProps) {
  const { socket } = useSocket()
  const [isViewing, setViewing] = useState(false)
  const currentParticipant = useParticipantContext()
  const {
    isLocal,
    isMicrophoneEnabled,
    isScreenShareEnabled,
    isSpeaking,
    identity,
  } = participant

  const startWatchHandler = () => {
    if (!currentParticipant || !socket) return
    socket.emit("screen-share:join", {
      viewer: currentParticipant,
      transmitter: participant,
    })
  }

  const stopWatchHandler = () => {
    if (!currentParticipant || !socket) return
    socket.emit("screen-share:leave", {
      viewer: currentParticipant,
      transmitter: participant,
    })
  }

  useEffect(() => {
    const startViewHandler: SocketFn = ({ viewer, transmitter }) => {
      if (
        viewer &&
        transmitter &&
        viewer.identity === currentParticipant.identity &&
        transmitter.identity === participant.identity
      ) {
        setViewing(true)
      }
    }

    const stopViewHandler: SocketFn = ({ viewer, transmitter }) => {
      if (
        viewer &&
        transmitter &&
        viewer.identity === currentParticipant.identity &&
        transmitter.identity === participant.identity
      ) {
        setViewing(false)
      }
    }

    socket?.on("screen-share:join", startViewHandler)
    socket?.on("screen-share:leave", stopViewHandler)

    return () => {
      socket?.removeListener("screen-share:join", startViewHandler)
      socket?.removeListener("screen-share:leave", stopViewHandler)
    }
  }, [])

  return (
    <div
      className={cn(
        "group relative flex flex-1 flex-col items-center justify-center gap-1 rounded-sm border-2 border-transparent bg-zinc-500",
        isSpeaking && "border-2 border-emerald-500 ",
      )}
    >
      <Avatar>
        <AvatarImage
          src={member.profile.imgUrl ?? ""}
          className="h-20 w-20 rounded-full bg-zinc-700"
        />
      </Avatar>
      <div className="absolute bottom-0 left-0 rounded-sm bg-zinc-800 p-[3px] text-xs font-semibold">
        <div className="flex gap-1">
          {!isMicrophoneEnabled && <MicOff className="h-4 w-4" />}
          {isScreenShareEnabled && (
            <Popover>
              <PopoverTrigger>
                <Monitor className="h-4 w-4 text-emerald-500" />
              </PopoverTrigger>
              <PopoverContent className="z-50 w-fit text-xs">
                This user is screen sharing right now.
              </PopoverContent>
            </Popover>
          )}
          {identity}
        </div>
      </div>
      {isScreenShareEnabled && !isLocal && !isViewing && (
        <button
          onClick={startWatchHandler}
          className="invisible absolute flex items-center justify-center gap-1 rounded-md bg-emerald-500 p-2 font-bold transition group-hover:visible"
        >
          <Eye className="h-6 w-6" />
          <span>Watch Screen</span>
        </button>
      )}
      {isScreenShareEnabled && !isLocal && isViewing && (
        <button
          onClick={stopWatchHandler}
          className="invisible absolute flex items-center justify-center gap-1 rounded-md bg-rose-500 p-2 font-bold transition group-hover:visible"
        >
          <X className="h-6 w-6" />
          <span>Leave Transmission</span>
        </button>
      )}
      <div></div>
    </div>
  )
}
