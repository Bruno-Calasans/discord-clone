import { redirect } from "next/navigation"
import { getChannelById } from "@/actions/channelActions"
import ChatHeader from "@/components/chat/ChannelChatHeader"
import ChatChannelInput from "@/components/chat/ChatChannelInput"
import ChatMessages from "@/components/chat/ChatMessages"
import { getCurrentProfile } from "@/actions/profileActions"
import { getCompleteServer } from "@/actions/serverActions"
import ChannelMediaRoom from "@/components/MediaRoom/ChannelMediaRoom"

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

  const channel = await getChannelById(channelId)
  if (!channel) return redirect("/")

  const profile = await getCurrentProfile()
  if (!profile) return redirect("/")

  const server = await getCompleteServer(serverId)
  if (!server) return redirect("/servers")

  const member = server.members.find((member) => member.profileId == profile.id)
  if (!member) return redirect("/servers")

  return (
    <section className="flex w-full flex-col dark:bg-zinc-800">
      <ChatHeader channel={channel} />

      {channel.type === "TEXT" && (
        <div className="flex flex-1 flex-col justify-end overflow-y-auto">
          <ChatMessages channel={channel} member={member} />
          <ChatChannelInput channel={channel} member={member} />
        </div>
      )}

      {channel.type === "AUDIO" && (
        <ChannelMediaRoom
          server={server}
          channel={channel}
          member={member}
          withAudio
        />
      )}

      {channel.type === "VIDEO" && (
        <ChannelMediaRoom
          server={server}
          channel={channel}
          member={member}
          withAudio
          withVideo
        />
      )}
    </section>
  )
}
