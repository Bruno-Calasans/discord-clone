import type { Channel } from "../../../prisma/output"
import { Hash } from "lucide-react"

type ChatWelcomeProps = {
  channel: Channel
}

export default function ChatWelcome({ channel }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col gap-1 justify-end items-start font-bold text-zinc-600 dark:text-zinc-400 pb-5 ">
      <div className="bg-zinc-300 dark:text-white dark:bg-zinc-600 rounded-full p-2">
        <Hash size="50px" />
      </div>
      <div className="text-4xl">
        Welcome to{" "}
        <span className="text-zinc-900 dark:text-white">#{channel.name}</span>
      </div>
      <div className="text-sm">
        This is the start of channel #{channel.name}
      </div>
    </div>
  )
}
