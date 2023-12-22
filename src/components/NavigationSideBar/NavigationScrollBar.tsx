"use client"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useRouter } from "next/navigation"
import type { Server } from "../../../prisma/output"
import NavigationItem from "./NavigationItem"
import ModeToggle from "../ui/ModeToggle"
import { UserButton } from "@clerk/nextjs"

type NavigationScrollBarProps = {
  servers: Server[]
  selectedServer?: string
}

function NavigationScrollBar({
  servers,
  selectedServer,
}: NavigationScrollBarProps) {
  const router = useRouter()

  const clickServerHandler = (server: Server) => {
    router.push(`/servers/${server.id}`)
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
      <div className="flex flex-col gap-2 justify-center items-center">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}

export default NavigationScrollBar
