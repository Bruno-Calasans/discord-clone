"use client"
import { ScrollArea } from "@radix-ui/react-scroll-area"
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
  return (
    <div className="flex h-full flex-col items-center justify-between">
      <ScrollArea className="flex flex-col items-center justify-center gap-2">
        {servers.length > 0 &&
          servers.map((server) => (
            <NavigationItem
              key={server.id}
              server={server}
              selected={server.id === selectedServer}
            />
          ))}
      </ScrollArea>
      <NavigationFooter />
    </div>
  )
}

export default NavigationScrollBar
