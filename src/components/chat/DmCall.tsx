"use client"

import useCall from "@/hooks/useCall/useCall"
import useDetectDevices from "@/hooks/useDetectDevices"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { Profile } from "../../../prisma/output"
import ActionTooltip from "../custom/ActionTooltip"
import { PhoneCall, PhoneOff, Video, VideoOff } from "lucide-react"
import { cn } from "@/utils/cn"
import GoingCall from "./GoingCall"
import DmMidiaRoom from "../MediaRoom/DmMidiaRoom"

type DmCallProps = {
  currentProfile: Profile
  otherProfile: Profile
  conversation: ConversationWithProfiles
}

export default function DmCall({
  currentProfile,
  otherProfile,
  conversation,
}: DmCallProps) {
  const { startCall, getGoingCall, getCall } = useCall()
  const { devices } = useDetectDevices()
  const hasGoingCall = getGoingCall(conversation.id)
  const hasCall = getCall(conversation.id)
  const mic = devices.microphone
  const camera = devices.camera
  const hideAudioCallBtn = !!(hasGoingCall || hasCall)
  const hideVideoCallBtn = !!(hasGoingCall || hasCall)

  const startVideoCallHandler = () => {
    startCall({ conversation, caller: currentProfile, called: otherProfile })
  }

  const startAudioCallHandler = () => {
    startCall({ conversation, caller: currentProfile, called: otherProfile })
  }

  return (
    <div>
      {/* buttons */}
      <div className="flex flex-row-reverse gap-3">
        {/* video call button */}
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

      {hasGoingCall && (
        <GoingCall
          conversation={conversation}
          currentProfile={currentProfile}
          otherProfile={otherProfile}
        />
      )}

      {hasCall && (
        <DmMidiaRoom
          conversation={conversation}
          currentProfile={currentProfile}
          otherProfile={otherProfile}
        />
      )}
    </div>
  )
}
