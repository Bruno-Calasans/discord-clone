"use client"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Video, VideoOff, PhoneCall, PhoneOff } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { cn } from "@/utils/cn"
import GoingCall from "./GoingCall"
import useDetectDevices from "@/hooks/useDetectDevices"
import useCall from "@/hooks/useCall"
import Call from "./Call"

type ChatHeaderProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function DMChatHeader({
  conversation,
  currentProfile,
  otherProfile,
}: ChatHeaderProps) {
  const { calls, goingCalls, startCall, getGoingCall, getCall } = useCall()
  const { devices } = useDetectDevices()

  const hasGoingCall = getGoingCall(conversation.id)
  const hasCall = getCall(conversation.id)
  const mic = devices.microphone
  const camera = devices.camera
  const hideAudioCallBtn = !!(hasGoingCall || hasCall)
  const hideVideoCallBtn = !!(hasGoingCall || hasCall)

  const startVideoCallHandler = () => {
    console.log("Starting video call...")
  }

  const startAudioCallHandler = () => {
    startCall({ conversation, caller: currentProfile, called: otherProfile })
  }

  console.log("has going call", goingCalls)
  console.log("has call", calls)

  return (
    <div className="relative flex h-12 w-full items-center justify-between gap-2 border-b-2 px-4 transition dark:border-neutral-800 dark:bg-zinc-900">
      {/* Going call  */}
      <GoingCall
        conversation={conversation}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
      />

      {/* Call */}
      <Call
        conversation={conversation}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
      />

      {/* Profile name and img */}
      <div className="flex items-center gap-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={otherProfile.imgUrl} />
        </Avatar>
        <p className="text-md font-semibold capitalize ">
          {otherProfile.username}
        </p>
      </div>

      {/* video call button */}
      <div className="flex flex-row-reverse gap-3">
        <ActionTooltip
          label={camera ? "Start video call" : "No camera avaliable"}
        >
          <button
            disabled={!camera || hideVideoCallBtn}
            onClick={startVideoCallHandler}
          >
            {camera ? (
              <Video
                className={cn(
                  "h-6 w-6 transition",
                  !hideVideoCallBtn && "hover:text-emerald-500",
                  hideVideoCallBtn && "text-zinc-500",
                )}
              />
            ) : (
              <VideoOff className="h-6 w-6 text-zinc-500" />
            )}
          </button>
        </ActionTooltip>

        {/* audio call button */}
        <ActionTooltip label={mic ? "Start audio call" : "No mic avaliable"}>
          <button
            disabled={!mic || hideAudioCallBtn}
            onClick={startAudioCallHandler}
            className="transition hover:text-emerald-500"
          >
            {mic ? (
              <PhoneCall
                className={cn(
                  "h-6 w-6 transition",
                  !hideAudioCallBtn && "hover:text-emerald-500",
                  hideAudioCallBtn && "text-zinc-500",
                )}
              />
            ) : (
              <PhoneOff className="h-6 w-6 text-zinc-500" />
            )}
          </button>
        </ActionTooltip>
      </div>
    </div>
  )
}
