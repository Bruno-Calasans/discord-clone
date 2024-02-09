"use client"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Video, VideoOff, PhoneCall, PhoneOff } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { cn } from "@/utils/cn"
import GoingCall from "./GoingCall"
import useDetectDevices from "@/hooks/useDetectDevices"
import useCall from "@/hooks/useCall/useCall"
import DmMidiaRoom from "../MediaRoom/DmMidiaRoom"
import UserAvatar from "../custom/UserAvatar"

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
    <div className="flex flex-col border-b-2  dark:border-neutral-800 dark:bg-zinc-900">
      <div className="relative flex h-fit w-full items-center  justify-between gap-2 p-2 px-4 transition ">
        {/* Profile name and img */}
        <div className="flex items-center gap-1">
          <UserAvatar
            imageUrl={otherProfile.imgUrl}
            alt={otherProfile.username}
          />
          <p className="text-md font-semibold capitalize ">
            {otherProfile.username}
          </p>
        </div>

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
