"use client"
import Separator from "@/components/ui/Separator"
import NavigationAction from "./NavigationAction"
import NavigationScrollBar from "./NavigationScrollBar"
import { useParams } from "next/navigation"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"

type NavigationSideBarProps = {
  servers: ServerWithMembersAndProfile[]
}

export default function NavigationSideBar({ servers }: NavigationSideBarProps) {
  const params = useParams()
  const selectedServer = params.serverId as string | undefined

  return (
    <aside className="flex flex-col bg-slate-100 p-2 dark:bg-slate-900  w-18 items-center space-y-3 h-full overflow-hidden border-r-[1.5px]">
      <NavigationAction />
      <Separator className="bg-slate-600 w-[80%]" />
      <NavigationScrollBar servers={servers} selectedServer={selectedServer} />
    </aside>
  )
}
