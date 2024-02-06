"use client"
import useLast from "@/hooks/useLast"
import { ServerWithChannels } from "@/types/ServerWithChannels"
import { redirect } from "next/navigation"
import Mount from "../custom/Mount"
import InitialCreateServerModal from "../modals/InitialCreateServerModal"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

type HomeRedirectPageProps = {
  servers: ServerWithChannels[]
}

export default function ServerRedirect({ servers }: HomeRedirectPageProps) {
  const [loading, setLoading] = useState(true)
  const { getLastServer, getLastChannel, saveLastServer, saveLastChannel } =
    useLast()

  const shouldRedirect = () => {
    if (servers.length === 0) return setLoading(false)

    const lastServerId = getLastServer()
    const lastChannelId = getLastChannel()

    const serverId = lastServerId ?? servers[0].id
    const channelId = lastChannelId ?? servers[0].channels[0].id

    saveLastServer(serverId)
    saveLastChannel(channelId)
    return redirect(`/servers/${serverId}/channels/${channelId}`)
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
