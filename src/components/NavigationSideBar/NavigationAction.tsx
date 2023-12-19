import ActionTooltip from "@/components/custom/ActionTooltip"
import { Plus } from "lucide-react"

type NavigationSideBarActionProps = {
  onClick: () => void
}

function NavigationSideBarAction({ onClick }: NavigationSideBarActionProps) {
  return (
    <div className="group dark:bg-slate-600 hover:bg-emerald-500 hover:dark:bg-emerald-500 h-10 w-10 rounded-full transition">
      <ActionTooltip label="Add new server" align="center" side="right">
        <button
          onClick={onClick}
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
