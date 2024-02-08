"use client"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"
import { cn } from "@/utils/cn"
import { useRouter } from "next/navigation"
import { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import useLast from "@/hooks/useLast"

type NavigationItemProps = {
  server: ServerWithMembersAndProfile
  selected?: boolean
}

function NavigationItem({ server, selected }: NavigationItemProps) {
  const router = useRouter()
  const { saveLastServer, saveLastChannel, getLastChannel, getLastServer } =
    useLast()

  const clickServerHandler = () => {
    const serverId = server.id
    const channelId = server.channels[0].id

    saveLastServer(serverId)
    saveLastChannel(channelId)

    router.push(`/servers/${serverId}/channels/${channelId}`)
  }

  return (
    <ActionTooltip label={server.name} align="center" side="right">
      <button
        className="relative flex"
        key={server.id}
        onClick={clickServerHandler}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[3px] rounded-r-sm bg-slate-600 transition-all dark:bg-white",
            !selected && "top-[50%] h-[4px]",
          )}
        ></div>

        <div className="relative ml-2 h-10 w-10">
          <Image
            src={server.imgUrl}
            className="rounded-full transition-all hover:rounded-[16px]"
            alt={server.name}
            fill
            sizes="(max-width: 1200px): 30vw"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
