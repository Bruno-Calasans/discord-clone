import { redirect } from "next/navigation"
import { findChannelById } from "@/actions/channelActions"
import ChatHeader from "@/components/chat/ChannelChatHeader"

type ChannelPageProps = {
  params: {
    serverId: string
    channelId: string
  }
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const channelId = params.channelId as string | undefined
  const serverId = params.serverId as string | undefined

  if (!channelId || !serverId) return redirect("/")

  const channel = await findChannelById(channelId)
  if (!channel) return redirect("/")

  return (
    <section className="w-full h-full bg-zinc-800">
      <ChatHeader channel={channel} />
    </section>
  )
}
