"use cliente"
import type { Server } from "../../../prisma/output"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"
import { cn } from "@/utils/cn"

type NavigationItemProps = {
  server: Server
  selected?: boolean
  onClick: (id: string) => void
}

function NavigationItem({ server, selected, onClick }: NavigationItemProps) {
  const clickHandler = () => {
    onClick(server.id)
  }

  return (
    <ActionTooltip label={server.name} align="center" side="right">
      <button className="flex relative" key={server.id} onClick={clickHandler}>
        <div
          className={cn(
            "absolute left-0 top-0 w-[3px] rounded-r-sm bg-slate-600 dark:bg-white transition-all h-full",
            !selected && "h-[4px] top-[50%]"
          )}
        ></div>

        <div className={`relative w-10 h-10 ml-2`}>
          <Image
            src={server.imgUrl}
            className="rounded-full hover:rounded-[16px] transition-all"
            alt={server.name}
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
