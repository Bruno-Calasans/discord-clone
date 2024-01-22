import { MemberWithProfile } from "@/types/MemberProfile"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { Channel } from "../../../prisma/output"
import {
  useParticipants,
  useRemoteParticipants,
  useRoomContext,
  PreJoin,
  useParticipantContext,
  useEnsureRoom,
} from "@livekit/components-react"
import { generateChannelToken } from "@/actions/livekitActions"
import Button from "../ui/Button"
import { Phone, PhoneCall } from "lucide-react"
import { RoomEvent } from "livekit-client"

type JoinRoomProps = {
  label?: React.ReactNode
  server: ServerWithMembersAndProfile
  currentMember: MemberWithProfile
  channel: Channel
}

export default function JoinRoom({
  label,
  server,
  currentMember,
  channel,
}: JoinRoomProps) {
  const room = useEnsureRoom()
  const participants = useParticipants()

  const joinRoomHandler = async () => {
    const token = await generateChannelToken({
      serverId: server.id,
      memberId: currentMember.id,
      channelId: channel.id,
    })
    if (!token || !process.env.NEXT_PUBLIC_LIVEKIT_URL) return
    await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token)
  }

  return (
    <div
      className="flex h-full
        flex-col items-center justify-center gap-2 text-emerald-500"
    >
      {/* //todo */}
      {/* <div className="font-bold text-zinc-400">
            <p className="">
               Membros no canal:{" "}
               <span className="font-semibold">{participants.length}</span>
            </p>
         </div> */}
      <button
        onClick={joinRoomHandler}
        className="group animate-pulse rounded-full border-2 border-emerald-500  bg-emerald-400 p-5 text-emerald-100 transition-all hover:shadow-md hover:shadow-emerald-300"
      >
        <Phone className="text-emerald700 h-10 w-10 group-hover:text-emerald-900 " />
      </button>
      <p className="text-xl font-bold capitalize">{label ?? "Join channel"}</p>
    </div>
  )
}
