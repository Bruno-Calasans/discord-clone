"use client"
import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { Video, VideoOff, PhoneCall, PhoneOff } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"
import { useEffect, useState } from "react"

type ChatHeaderProps = {
  profile: Profile
}

type AvaliableMediaDevices = {
  camera: boolean
  microphone: boolean
}

export default function DMChatHeader({ profile }: ChatHeaderProps) {
  const startVideoCallHandler = () => {}

  const startAudioCallHandler = () => {}

  const [devices, setDevices] = useState<AvaliableMediaDevices>({
    camera: false,
    microphone: false,
  })

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

  useEffect(() => {
    detectDevices()
  }, [profile.id])

  return (
    <div className="flex h-12 w-full items-center justify-between gap-2 border-b-2 px-4 transition dark:border-neutral-800 dark:bg-zinc-900">
      <div className="flex items-center gap-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile.imgUrl} />
        </Avatar>
        <p className="text-md font-semibold capitalize ">{profile.username}</p>
      </div>
      <div className="flex gap-3">
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
        <ActionTooltip
          label={devices.microphone ? "Start audio call" : "No mic avaliable"}
        >
          <button
            disabled={!devices.microphone}
            onClick={startAudioCallHandler}
            className="transition hover:text-emerald-500"
          >
            {devices.microphone ? (
              <PhoneCall className="h-6 w-6 transition hover:text-emerald-500" />
            ) : (
              <PhoneOff className="h-6 w-6 text-zinc-500" />
            )}
          </button>
        </ActionTooltip>
      </div>
    </div>
  )
}
