"use client"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Video, VideoOff, PhoneCall, PhoneOff, X } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"
import { useEffect, useState } from "react"
import useCall from "@/hooks/useCall"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { cn } from "@/utils/cn"

type ChatHeaderProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

type AvaliableMediaDevices = {
  camera: boolean
  microphone: boolean
}

export default function DMChatHeader({
  conversation,
  currentProfile,
  otherProfile,
}: ChatHeaderProps) {
  const { calls, goingCalls, startCall, stopCall, joinCall } = useCall()
  const [calling, setCalling] = useState(false)
  const [devices, setDevices] = useState<AvaliableMediaDevices>({
    camera: false,
    microphone: false,
  })
  const hasGoingCall = goingCalls.find(
    (call) =>
      (call.conversation.id === conversation.id &&
        call.called.id === currentProfile.id) ||
      call.caller.id === currentProfile.id,
  )
  const hasCall = calls.find(
    (call) =>
      (call.conversation.id === conversation.id &&
        call.called.id === currentProfile.id) ||
      call.caller.id === currentProfile.id,
  )
  const isCalling = hasGoingCall?.caller.id === currentProfile.id
  const isBeingCalled = hasGoingCall?.called.id === currentProfile.id

  const detectDevices = async () => {
    const midias: AvaliableMediaDevices = {
      camera: false,
      microphone: false,
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
      if (device.kind === "videoinput") {
        midias.camera = true
      }

      if (device.kind === "audioinput") {
        midias.microphone = true
      }
    }

    setDevices(midias)
  }

  const startVideoCallHandler = () => {
    console.log("Starting video call...")
  }

  const startAudioCallHandler = () => {
    console.log("Starting audio call...")
    startCall({ conversation, caller: currentProfile, called: otherProfile })
  }

  const stopCallHandler = () => {
    console.log("Stopping audio call...")
    stopCall({ conversation, caller: currentProfile, called: otherProfile })
  }

  const joinCallHandler = () => {
    console.log("Joining audio call...")
    joinCall({ conversation, caller: otherProfile, called: currentProfile })
  }
  useEffect(() => {
    detectDevices()
  }, [otherProfile.id])

  console.log(calls, goingCalls)

  return (
    <div className="relative flex h-12 w-full items-center justify-between gap-2 border-b-2 px-4 transition dark:border-neutral-800 dark:bg-zinc-900">
      {/* Call  */}
      {hasGoingCall && (
        <div className="absolute right-0 top-[46px] z-20 flex h-48 w-full flex-col items-center justify-center gap-3 bg-zinc-700">
          <div className="flex items-center justify-center gap-5">
            {/* Calling */}
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentProfile.imgUrl} />
            </Avatar>
            {/* Called */}
            <Avatar className="h-16 w-16 animate-pulse opacity-50">
              <AvatarImage src={otherProfile.imgUrl} />
            </Avatar>
          </div>
          {/* Calling */}
          {isCalling && (
            <div>
              <p>
                <span className="font-bold">You</span> are calling{" "}
                <span className="font-bold">
                  {hasGoingCall.called.username}
                </span>
                ...
              </p>
            </div>
          )}
          {/* Being called */}
          {isBeingCalled && (
            <div>
              <p>
                <span className="font-bold">
                  {hasGoingCall.caller.username}
                </span>{" "}
                is calling <span className="font-bold">you</span>
                ...
              </p>
            </div>
          )}
          {/* calling buttons */}
          <div className="flex gap-2">
            {isBeingCalled && (
              <button
                onClick={joinCallHandler}
                className="rounded-full bg-emerald-500 p-3 opacity-50 transition hover:opacity-100"
              >
                <PhoneCall className="h-8 w-8 text-white" />
              </button>
            )}
            <button
              onClick={stopCallHandler}
              className="rounded-full bg-rose-500 p-3 opacity-50 transition hover:opacity-100"
            >
              <X className="h-8 w-8 text-white transition" />
            </button>
          </div>
        </div>
      )}

      {/* Profile name and img */}
      <div className="flex items-center gap-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={otherProfile.imgUrl} />
        </Avatar>
        <p className="text-md font-semibold capitalize ">
          {otherProfile.username}
        </p>
      </div>

      {/* Header buttons */}
      {/* video call button */}
      <div className="flex flex-row-reverse gap-3">
        <ActionTooltip
          label={devices.camera ? "Start video call" : "No camera avaliable"}
        >
          <button disabled={!devices.camera} onClick={startVideoCallHandler}>
            {devices.camera ? (
              <Video className="h-6 w-6 transition hover:text-emerald-500" />
            ) : (
              <VideoOff className="h-6 w-6 text-zinc-500" />
            )}
          </button>
        </ActionTooltip>

        {/* audio call button */}
        <ActionTooltip
          label={devices.microphone ? "Start audio call" : "No mic avaliable"}
        >
          <button
            disabled={!devices.microphone || !!hasGoingCall}
            onClick={startAudioCallHandler}
            className="transition hover:text-emerald-500"
          >
            {devices.microphone ? (
              <PhoneCall
                className={cn(
                  "h-6 w-6 transition",
                  !hasGoingCall && "hover:text-emerald-500",
                  hasGoingCall && "text-zinc-500",
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
