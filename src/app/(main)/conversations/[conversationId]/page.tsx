import { redirect } from "next/navigation"
import { getConversationById } from "@/actions/conversationActions"
import { getCurrentProfile } from "@/actions/profileActions"
import DMChatHeader from "@/components/chat/DmChatHeader"
import ChatDmInput from "@/components/chat/ChatDmInput"
import ChatDmMessages from "@/components/chat/ChatDmMessages"

type ConversationPageProps = {
  params: {
    conversationId: string
  }
}

export async function generateMetadata({ params }: ConversationPageProps) {
  const conversationId = params.conversationId

  const profile = await getCurrentProfile()
  if (!profile) return

  const conversation = await getConversationById(conversationId)
  if (!conversation) return

  const { senderProfileId, senderProfile, receiverProfile } = conversation

  const otherProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return {
    title: otherProfile.username,
    icons: {
      icon: otherProfile.imgUrl,
    },
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

  const { senderProfileId, senderProfile, receiverProfile } = conversation

  const otherProfile =
    profile.id === senderProfileId ? receiverProfile : senderProfile

  return (
    <section className="flex w-full flex-col dark:bg-zinc-800">
      <DMChatHeader
        conversation={conversation}
        currentProfile={profile}
        otherProfile={otherProfile}
      />
      <div className="flex flex-1 flex-col justify-end overflow-y-auto">
        <ChatDmMessages
          conversation={conversation}
          currentProfile={profile}
          otherProfile={otherProfile}
        />
        <ChatDmInput
          conversation={conversation}
          currentProfile={profile}
          otherProfile={otherProfile}
        />
      </div>
    </section>
  )
}
