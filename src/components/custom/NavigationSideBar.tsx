"use client"
import { Plus } from "lucide-react"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Separator from "@/components/ui/Separator"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import * as serverActions from "@/actions/serverActions"
import { useEffect, useState } from "react"
import NavigationItem from "./NavigationItem"
import type { Server } from "../../../prisma/output"
import { useParams } from "next/navigation"

function NavigationSideBar() {
  const params = useParams()
  const [servers, setServers] = useState<Server[]>([])
  const [selectedServer, setServer] = useState(params.serverId)

  const loadServers = async () => {
    const servers = await serverActions.getServers()
    if (!servers) return
    setServers(servers)
  }

  useEffect(() => {
    loadServers()
  }, [])

  return (
    <aside className="flex flex-col p-2 bg-slate-900 w-18 items-center space-y-3 h-full overflow-hidden">
      <ActionTooltip label="Add new server" align="start" side="right">
        <div className="group bg-slate-700 hover:bg-emerald-500 h-14 w-14 rounded-full transition">
          <button className="flex items-center justify-center content-center h-full w-full">
            <Plus
              size={35}
              className="text-emerald-500 group-hover:text-white transition"
            />
          </button>
        </div>
      </ActionTooltip>

      <Separator className="bg-slate-600 w-[80%]" />

      <ScrollArea className="w-full justify-center items-center">
        {servers.length > 0 &&
          servers.map((server) => (
            <NavigationItem
              key={server.id}
              server={server}
              selected={server.id === selectedServer}
              onClick={console.log}
            />
          ))}
      </ScrollArea>
    </aside>
  )
}

export default NavigationSideBar
