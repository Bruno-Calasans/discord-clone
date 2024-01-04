"use client"
import ActionTooltip from "@/components/custom/ActionTooltip"
import { Plus } from "lucide-react"
import useModal from "@/hooks/useModal/useModal"

export default function CreateServerAction() {
  const { open } = useModal()

  const modalHandler = () => {
    open(`CreateServer`)
  }

  return (
    <div className="group  bg-slate-200 dark:bg-slate-600 hover:bg-emerald-500 hover:dark:bg-emerald-500 h-10 w-10 rounded-full transition">
      <ActionTooltip label="Add new server" align="center" side="right">
        <button
          onClick={modalHandler}
          className="flex items-center justify-center content-center h-full w-full p-2"
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
