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
      <button className="relative flex" key={server.id} onClick={clickHandler}>
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[3px] rounded-r-sm bg-slate-600 transition-all dark:bg-white",
            !selected && "top-[50%] h-[4px]",
          )}
        ></div>

        <div className={`relative ml-2 h-10 w-10`}>
          <Image
            src={server.imgUrl}
            className="rounded-full transition-all hover:rounded-[16px]"
            alt={server.name}
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
