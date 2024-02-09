import { MemberWithProfile } from "@/types/MemberProfile"
import { CircleUserRound, X } from "lucide-react"
import { useState } from "react"

type SeeProfileMember = {
  member: MemberWithProfile
  onChange?: () => void
}

export default function SeeProfileMemberButton({
  onChange,
  member,
}: SeeProfileMember) {
  const [loading, setLoading] = useState(false)

  const seeMemberProfileHandler = async () => {
    setLoading(true)
    // await seeProfileMember(member.id)
    setLoading(false)
    if (onChange) onChange()
  }

  return (
    <button
      className="flex w-full items-center gap-1 rounded-md p-1 text-sm hover:bg-stone-800"
      disabled={loading}
      onClick={seeMemberProfileHandler}
    >
      <CircleUserRound className="h-4 w-4" />
      See profile
    </button>
  )
}
