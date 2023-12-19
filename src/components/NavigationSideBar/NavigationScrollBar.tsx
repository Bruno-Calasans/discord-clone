import { ScrollArea } from "@radix-ui/react-scroll-area"
import type { Server } from "../../../prisma/output"
import NavigationItem from "./NavigationItem"
import ModeToggle from "../ui/ModeToggle"

type NavigationScrollBarProps = {
  servers: Server[]
  selectedServer?: string
  onClick: (serverId: string) => void
}

function NavigationScrollBar({
  servers,
  selectedServer,
  onClick,
}: NavigationScrollBarProps) {
  const clickServerHandler = (server: Server) => {
    onClick(server.id)
  }

  return (
    <div className="flex flex-col h-full justify-between">
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
      <ModeToggle />
    </div>
  )
}

export default NavigationScrollBar
