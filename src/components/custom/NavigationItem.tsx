"use cliente"
import type { Server } from "../../../prisma/output"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"

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
      <div
        className="flex cursor-pointer"
        key={server.id}
        onClick={clickHandler}
      >
        {selected && (
          <div className="absolute left-0 top-0 h-full w-[4px] rounded-r-sm bg-white"></div>
        )}
        <div className={`relative w-14 h-14 ${selected ? "ml-2" : ""}`}>
          <Image
            src={server.imgUrl}
            className="rounded-[16px]"
            alt={server.name}
            fill
          />
        </div>
      </div>
    </ActionTooltip>
  )
}

export default NavigationItem
