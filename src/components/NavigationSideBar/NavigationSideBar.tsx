"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getServersByProfileId } from "@/actions/serverActions"
import { getCurrentProfile } from "@/actions/profileActions"
import type { Server } from "../../../prisma/output"
import Separator from "@/components/ui/Separator"
import NavigationAction from "./NavigationAction"
import NavigationScrollBar from "./NavigationScrollBar"
import useModal from "@/hooks/useModal/useModal"

function NavigationSideBar() {
  const params = useParams()
  const router = useRouter()
  const { isOpen, open } = useModal()
  const [servers, setServers] = useState<Server[]>([])
  const [selectedServer, setServer] = useState<string>(
    params.serverId as string
  )

  const loadServers = async () => {
    const profile = await getCurrentProfile()
    if (!profile) return

    const servers = await getServersByProfileId(profile.id)
    if (!servers) return

    setServers(servers)
  }

  const openModalHandler = () => {
    open("CreateServer")
  }

  const selectServerHandler = (serverId: string) => {
    setServer(serverId)
    router.push(`/servers/${selectedServer}`)
  }

  useEffect(() => {
    if (!isOpen) {
      loadServers()
    }
  }, [isOpen])

  return (
    <aside className="flex flex-col p-2 dark:bg-slate-900   w-18 items-center space-y-3 h-full overflow-hidden border-r-[1.5px]">
      <NavigationAction onClick={openModalHandler} />

      <Separator className="bg-slate-600 w-[80%]" />

      <NavigationScrollBar
        servers={servers}
        selectedServer={selectedServer}
        onClick={selectServerHandler}
      />
    </aside>
  )
}

export default NavigationSideBar
