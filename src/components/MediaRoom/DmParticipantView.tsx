/* eslint-disable react-hooks/exhaustive-deps */
import { cn } from "@/utils/cn"
import { useParticipantContext } from "@livekit/components-react"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Eye, MicOff, Monitor, X } from "lucide-react"
import type { Participant } from "livekit-client"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { Profile } from "../../../prisma/output"
import useTransmission from "@/hooks/useTransmission/useTransmission"

type DmParticipantViewProps = {
  participant: Participant
  profile: Profile
}

export default function DmParticipantView({
  participant,
  profile,
}: DmParticipantViewProps) {
  const { joinTransmission, leaveTransmission, getViewer } = useTransmission()
  const currentParticipant = useParticipantContext()
  const isViewer = getViewer(currentParticipant)

  const { isLocal, isMicrophoneEnabled, isScreenShareEnabled, isSpeaking } =
    participant

  const joinTransmissionHandler = () => {
    joinTransmission(participant, currentParticipant)
  }

  const leaveTransmissionHandler = () => {
    leaveTransmission(participant, currentParticipant)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center gap-1 rounded-full border-2 border-transparent ",
        isSpeaking && "border-emerald-500",
      )}
    >
      <Avatar className="relative">
        <AvatarImage
          src={profile.imgUrl ?? ""}
          className="h-20 w-20 rounded-full  bg-zinc-700"
        />
        {!isMicrophoneEnabled && (
          <MicOff className="absolute bottom-0 right-0 h-6 w-6 rounded-full  bg-zinc-700 p-1 text-white" />
        )}
      </Avatar>

      {/* Participant is muted or transmitting */}
      <div className="absolute bottom-0 left-0 rounded-sm p-[3px] text-xs font-semibold">
        <div className="flex gap-1">
          {isScreenShareEnabled && (
            <Popover>
              <PopoverTrigger>
                <Monitor className="h-4 w-4  text-emerald-500" />
              </PopoverTrigger>
              <PopoverContent className="z-50 w-fit text-xs">
                This user is screen sharing right now.
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Start to be a Viewer */}
      {isScreenShareEnabled && !isLocal && !isViewer && (
        <button
          onClick={joinTransmissionHandler}
          className="bg-text-500 invisible absolute flex items-center justify-center gap-1 rounded-md p-2 font-bold transition group-hover:visible"
        >
          <Eye className="h-6 w-6 text-emerald-500" />
        </button>
      )}

      {/* Stop to be a viewer */}
      {isScreenShareEnabled && !isLocal && isViewer && (
        <button
          onClick={leaveTransmissionHandler}
          className="bg-text-500 invisible absolute flex items-center justify-center gap-1 rounded-md bg-rose-500  font-bold transition group-hover:visible"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  )
}
