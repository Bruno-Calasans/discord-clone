"use client"
import useLast from "@/hooks/useLast"
import { redirect } from "next/navigation"
import Mount from "../custom/Mount"
import InitialCreateServerModal from "../modals/InitialCreateServerModal"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"

type HomeRedirectPageProps = {
  conversations: ConversationWithProfiles[]
}

export default function ConversationRedirect({
  conversations,
}: HomeRedirectPageProps) {
  const [loading, setLoading] = useState(true)
  const { saveLastConversation, getLastConversation } = useLast()

  const shouldRedirect = () => {
    if (conversations.length > 0) {
      const lastConversationId = getLastConversation()

      const conversationId = lastConversationId ?? conversations[0].id
      saveLastConversation(conversationId)

      return redirect(`/conversations/${conversationId}`)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) return
    shouldRedirect()
  }, [])

  if (loading) {
    return (
      <div className="absolute flex h-full w-full flex-col items-center justify-center gap-1 bg-zinc-900">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Redirecting...</p>
      </div>
    )
  }

  return (
    <main>
      <Mount>
        <InitialCreateServerModal />
      </Mount>
    </main>
  )
}
