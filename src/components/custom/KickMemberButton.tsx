import { kickMember } from "@/actions/memberActions"
import { MemberWithProfile } from "@/types/MemberProfile"
import { X } from "lucide-react"
import { useState } from "react"

type KickMemberButtonProps = {
  member: MemberWithProfile
  onChange?: () => void
}

export default function KickMemberButton({
  onChange,
  member,
}: KickMemberButtonProps) {
  const [loading, setLoading] = useState(false)

  const kickMemberHandler = async () => {
    setLoading(true)
    await kickMember(member.id)
    setLoading(false)
    if (onChange) onChange()
  }

  return (
    <button
      className="flex w-full items-center gap-1 rounded-md p-1 text-sm hover:bg-stone-800"
      disabled={loading}
      onClick={kickMemberHandler}
    >
      <X className="h-4 w-4" />
      Kick
    </button>
  )
}
