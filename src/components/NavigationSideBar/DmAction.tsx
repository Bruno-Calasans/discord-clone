import { useRouter } from "next/navigation"
import ActionTooltip from "../custom/ActionTooltip"
import { MessagesSquare } from "lucide-react"

export default function DmAction() {
  const router = useRouter()

  const clickHandler = () => {
    router.push("/conversations")
  }

  return (
    <div
      onClick={clickHandler}
      className="group  bg-slate-200 dark:bg-slate-600 hover:bg-emerald-500 hover:dark:bg-emerald-500 h-10 w-10 rounded-full transition"
    >
      <ActionTooltip label="Direct messages" align="center" side="right">
        <button className="flex items-center justify-center content-center h-full w-full p-2">
          <MessagesSquare
            size={35}
            className="text-emerald-500 group-hover:text-white transition"
          />
        </button>
      </ActionTooltip>
    </div>
  )
}
