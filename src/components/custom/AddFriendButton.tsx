// import { addFriend } from "@/actions/memberActions"
import { MemberWithProfile } from "@/types/MemberProfile"
import { UserRoundPlus } from "lucide-react"
import { useState } from "react"

type AddFriendButtonProps = {
  member: MemberWithProfile
  onChange?: () => void
}

export default function AddFriendButton({
  onChange,
  member,
}: AddFriendButtonProps) {
  const [loading, setLoading] = useState(false)

  const addFriendHandler = async () => {
    setLoading(true)
    // await addFriend(member.id)
    setLoading(false)
    if (onChange) onChange()
  }

  return (
    <button
      className="flex w-full items-center gap-1 rounded-md p-1 text-sm hover:bg-stone-800"
      disabled={loading}
      onClick={addFriendHandler}
    >
      <UserRoundPlus className="h-4 w-4" />
      Add friend
    </button>
  )
}
