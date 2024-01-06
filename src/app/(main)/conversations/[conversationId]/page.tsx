import { redirect } from "next/navigation"
import { getConversationById } from "@/actions/conversationActions"
import { getCurrentProfile } from "@/actions/profileActions"
import DMChatHeader from "@/components/chat/DmChatHeader"

type ConversationPageProps = {
  params: {
    conversationId: string
  }
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const conversationId = params.conversationId

  const conversation = await getConversationById(conversationId)
  if (!conversation) return redirect("/conversations")

  const profile = await getCurrentProfile()
  if (!profile) return redirect("/")

  return (
    <div className="w-full bg-zinc-800">
      <DMChatHeader profile={profile} conversation={conversation} />
    </div>
  )
}
