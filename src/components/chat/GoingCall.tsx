import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Profile } from "../../../prisma/output"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import { PhoneCall, X } from "lucide-react"
import useCall from "@/hooks/useCall"

type GoingCallProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function GoingCall({
  conversation,
  currentProfile,
  otherProfile,
}: GoingCallProps) {
  const { goingCalls, stopCall, joinCall, getGoingCall } = useCall()
  const hasGoingCall = getGoingCall(conversation.id)
  const isCalling = hasGoingCall?.caller.id === currentProfile.id
  const isBeingCalled = hasGoingCall?.called.id === currentProfile.id

  const joinCallHandler = () => {
    joinCall({ conversation, caller: otherProfile, called: currentProfile })
  }

  const stopCallHandler = () => {
    stopCall({ conversation, caller: otherProfile, called: currentProfile })
  }

  if (!hasGoingCall) return null

  return (
    <div className="absolute right-0 top-[46px] z-20 flex h-48 w-full flex-col items-center justify-center gap-3 bg-zinc-900">
      <div className="flex items-center justify-center gap-5">
        {/* Calling */}
        <Avatar className="h-16 w-16 rounded-full">
          <AvatarImage className="rounded-full" src={currentProfile.imgUrl} />
        </Avatar>
        {/* Called */}
        <Avatar className="h-16 w-16 animate-pulse rounded-full opacity-50">
          <AvatarImage className="rounded-full" src={otherProfile.imgUrl} />
        </Avatar>
      </div>
      {/* Calling */}
      {isCalling && (
        <div>
          <p>
            <span className="font-bold">You</span> are calling{" "}
            <span className="font-bold">{hasGoingCall.called.username}</span>
            ...
          </p>
        </div>
      )}
      {/* Being called */}
      {isBeingCalled && (
        <div>
          <p>
            <span className="font-bold">{hasGoingCall.caller.username}</span> is
            calling <span className="font-bold">you</span>
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
  )
}
