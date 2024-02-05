import { useRouter, usePathname } from "next/navigation"
import ActionTooltip from "../custom/ActionTooltip"
import { MessagesSquare } from "lucide-react"
import { cn } from "@/utils/cn"

export default function DmAction() {
  const router = useRouter()
  const pathname = usePathname()

  const isConversationSelected = pathname
    ?.toLocaleLowerCase()
    .includes("conversations")

  const clickHandler = () => {
    router.push("/conversations")
  }

  return (
    <div
      onClick={clickHandler}
      className={cn(
        "group  h-10 w-10 rounded-full bg-slate-200 transition hover:bg-emerald-500 dark:bg-slate-600 hover:dark:bg-emerald-500",
        isConversationSelected &&
          "bg-emerald-500 text-white dark:bg-emerald-500",
      )}
    >
      <ActionTooltip label="Direct messages" align="center" side="right">
        <button className="flex h-full w-full content-center items-center justify-center p-2">
          <MessagesSquare
            size={35}
            className={cn(
              "rounded-full text-emerald-500 transition group-hover:text-white",
              isConversationSelected &&
                "bg-emerald-500 text-white dark:bg-emerald-500",
            )}
          />
        </button>
      </ActionTooltip>
    </div>
  )
}
