"use client"
import ActionTooltip from "@/components/custom/ActionTooltip"
import { Plus } from "lucide-react"
import useModal from "@/hooks/useModal/useModal"

function NavigationSideBarAction() {
  const { open } = useModal()

  const modalHandler = () => {
    open(`CreateServer`)
  }

  return (
    <div className="group p-1 bg-slate-200 dark:bg-slate-600 hover:bg-emerald-500 hover:dark:bg-emerald-500 h-10 w-10 rounded-full transition">
      <ActionTooltip label="Add new server" align="center" side="right">
        <button
          onClick={modalHandler}
          className="flex items-center justify-center content-center h-full w-full"
        >
          <Plus
            size={35}
            className="text-emerald-500 group-hover:text-white transition"
          />
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationSideBarAction
