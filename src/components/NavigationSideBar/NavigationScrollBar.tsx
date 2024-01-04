"use client"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useRouter } from "next/navigation"
import NavigationItem from "./NavigationItem"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import NavigationFooter from "./NavigationFooter"

type NavigationScrollBarProps = {
  servers: ServerWithMembersAndProfile[]
  selectedServer?: string
}

function NavigationScrollBar({
  servers,
  selectedServer,
}: NavigationScrollBarProps) {
  const router = useRouter()

  const clickServerHandler = async (server: ServerWithMembersAndProfile) => {
    const firstChannel = server.channels[0]
    router.push(`/servers/${server.id}/channels/${firstChannel.id}`)
  }

  return (
    <div className="flex flex-col h-full justify-between items-center">
      <ScrollArea className="flex flex-col justify-center items-center gap-2">
        {servers.length > 0 &&
          servers.map((server) => (
            <NavigationItem
              key={server.id}
              server={server}
              selected={server.id === selectedServer}
              onClick={() => clickServerHandler(server)}
            />
          ))}
      </ScrollArea>
      <NavigationFooter />
    </div>
  )
}

export default NavigationScrollBar
