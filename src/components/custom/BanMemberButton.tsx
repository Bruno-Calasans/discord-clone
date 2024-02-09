import { banMember } from "@/actions/memberActions"
import { MemberWithProfile } from "@/types/MemberProfile"
import { Ban, X } from "lucide-react"
import { useState } from "react"

type BanMemberButtonProps = {
  member: MemberWithProfile
  onChange?: () => void
}

export default function BanMemberButton({
  onChange,
  member,
}: BanMemberButtonProps) {
  const [loading, setLoading] = useState(false)

  const banMemberHandler = async () => {
    setLoading(true)
    await banMember(member.id)
    setLoading(false)
    if (onChange) onChange()
  }

  return (
    <button
      className="flex w-full items-center gap-1 rounded-md p-1 text-sm hover:bg-stone-800"
      disabled={loading}
      onClick={banMemberHandler}
    >
      <Ban className="h-4 w-4" />
      Ban
    </button>
  )
}
