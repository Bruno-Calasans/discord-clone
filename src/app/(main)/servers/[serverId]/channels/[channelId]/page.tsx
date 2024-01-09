import { redirect } from "next/navigation"
import { findChannelById } from "@/actions/channelActions"
import ChatHeader from "@/components/chat/ChannelChatHeader"
import ChatChannelInput from "@/components/chat/ChatChannelInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { getCurrentProfile } from "@/actions/profileActions"
import { getCompleteServer } from "@/actions/serverActions"
import { getChannelMessages } from "@/actions/messageActions"

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

  const profile = await getCurrentProfile()
  if (!profile) return redirect("/")

  const server = await getCompleteServer(serverId)
  if (!server) return redirect("/servers")

  const member = server.members.find((member) => member.profileId == profile.id)
  if (!member) return redirect("/servers")

  return (
    <section className="flex flex-col w-full h-full dark:bg-zinc-800">
      <ChatHeader channel={channel} />
      <div className="flex flex-col justify-end flex-1">
        <ChatMessages channel={channel} member={member} />
        <ChatChannelInput channel={channel} member={member} />
      </div>
    </section>
  )
}
