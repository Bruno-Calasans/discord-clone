"use client"
import Separator from "@/components/ui/Separator"
import NavigationAction from "./NavigationAction"
import NavigationScrollBar from "./NavigationScrollBar"
import { useParams } from "next/navigation"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { cn } from "@/utils/cn"

type NavigationSideBarProps = {
  servers: ServerWithMembersAndProfile[]
  classname?: string
}

export default function NavigationSideBar({
  servers,
  classname,
}: NavigationSideBarProps) {
  const params = useParams()
  const selectedServer = params.serverId as string | undefined

  return (
    <aside
      className={cn(
        "flex flex-col bg-slate-100 p-2 dark:bg-slate-900 items-center space-y-3 h-full overflow-hidden border-r-[1.5px] w-[80px] transition max-md:hidden",
        classname
      )}
    >
      <NavigationAction />
      <Separator className="bg-slate-600 w-[80%]" />
      <NavigationScrollBar servers={servers} selectedServer={selectedServer} />
    </aside>
  )
}
