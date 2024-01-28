import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Profile } from "../../../prisma/output"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { PhoneCall, X, Mic, MicOff } from "lucide-react"
import useCall from "@/hooks/useCall"
import { useState } from "react"

type CallProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function Call({
  conversation,
  currentProfile,
  otherProfile,
}: CallProps) {
  const [isMuted, setMuted] = useState(false)
  const { getCall, leaveCall } = useCall()
  const hasCall = getCall(conversation.id)
  const isCalled = hasCall?.called.id === currentProfile.id
  const isCaller = hasCall?.caller.id === currentProfile.id

  const toggleMute = () => {
    setMuted((curr) => !curr)
  }

  const leaveCallHandler = () => {
    leaveCall({ conversation, caller: otherProfile, called: currentProfile })
  }

  if (!hasCall) return null

  return (
    <div className="absolute right-0 top-[46px] z-20 flex h-48 w-full flex-col items-center justify-center gap-5 bg-zinc-900">
      <div className="flex items-center justify-center gap-5">
        {/* Calling */}
        <Avatar className="h-20 w-20 rounded-full">
          <AvatarImage className="rounded-full" src={currentProfile.imgUrl} />
        </Avatar>
        {/* Called */}
        <Avatar className="h-20 w-20 animate-pulse rounded-full opacity-50">
          <AvatarImage className="rounded-full" src={otherProfile.imgUrl} />
        </Avatar>
      </div>

      {/* calling buttons */}
      <div className="flex gap-2">
        <button
          onClick={toggleMute}
          className="rounded-full bg-zinc-600 p-3 opacity-50 transition hover:opacity-100"
        >
          {isMuted ? (
            <MicOff className="h-8 w-8 text-white transition" />
          ) : (
            <Mic className="h-8 w-8 text-white transition" />
          )}
        </button>
        <button
          onClick={leaveCallHandler}
          className="rounded-full bg-rose-500 p-3 opacity-50 transition hover:opacity-100"
        >
          <X className="h-8 w-8 text-white transition" />
        </button>
      </div>
    </div>
  )
}
