"use client"
import Separator from "@/components/ui/Separator"
import CreateServerAction from "./CreateServerAction"
import NavigationScrollBar from "./NavigationScrollBar"
import DmAction from "./DmAction"
import { useParams } from "next/navigation"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { cn } from "@/utils/cn"

type NavigationSideBarProps = {
  servers: ServerWithMembersAndProfile[]
  show?: boolean
}

export default function NavigationSideBar({
  servers,
  show,
}: NavigationSideBarProps) {
  const params = useParams()
  const selectedServer = params?.serverId as string | undefined

  return (
    <aside
      className={cn(
        "flex h-full w-[80px] flex-col items-center space-y-2 overflow-hidden border-r-[1.5px] bg-slate-100 p-2 transition dark:bg-zinc-900 max-md:hidden",
        show && "max-md:flex",
      )}
    >
      <DmAction />
      <CreateServerAction />
      <Separator className="w-[80%] bg-slate-600" />
      <NavigationScrollBar servers={servers} selectedServer={selectedServer} />
    </aside>
  )
}
