"use client"

import { findOrCreateConversation } from "@/actions/conversationActions"
import { MessagesSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Profile } from "../../../prisma/output"

type CreateDmButtonProps = {
  currentProfile: Profile
  otherProfile: Profile
  onChange?: () => void
}

export default function CreateDmButton({
  onChange,
  currentProfile,
  otherProfile,
}: CreateDmButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const createConversationHandler = async () => {
    setLoading(true)
    const conversation = await findOrCreateConversation(
      currentProfile.id,
      otherProfile.id,
    )
    if (!conversation) return
    router.push(`/conversations/${conversation.id}`)
    setLoading(false)
  }

  return (
    <button
      className="flex w-full items-center gap-1 rounded-md p-1 text-sm hover:bg-stone-800"
      disabled={loading}
      onClick={createConversationHandler}
    >
      <MessagesSquare className="h-4 w-4" />
      Direct message
    </button>
  )
}
