import { redirect } from "next/navigation"
import { findChannelById } from "@/actions/channelActions"
import ChatHeader from "@/components/chat/ChatHeader"
import MobileMenuToggle from "@/components/chat/MobileMenuToggle"

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
    <section className="w-full h-full">
      <div className="flex gap-1 w-full items-center font-semibold text-md dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 px-2 transition">
        <MobileMenuToggle serverId={serverId} />
        <ChatHeader channel={channel} type="channel" />
      </div>
    </section>
  )
}
