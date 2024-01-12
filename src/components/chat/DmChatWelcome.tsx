import { Hash } from "lucide-react"
import { Profile } from "../../../prisma/output"

type DmChatWelcomeProps = {
  profile: Profile
}

export default function DmChatWelcome({ profile }: DmChatWelcomeProps) {
  return (
    <div className="flex flex-col gap-1 justify-end items-start font-bold text-zinc-600 dark:text-zinc-400 pb-5 mt-5">
      <div className="bg-zinc-300 dark:text-white dark:bg-zinc-600 rounded-full p-2">
        <Hash size="50px" />
      </div>
      <div className="text-4xl">
        Start a conversation with{" "}
        <span className="text-zinc-900 dark:text-white">
          {profile.username}
        </span>
      </div>
      <div className="text-sm">
        This is the start of conversation with {profile.username}
      </div>
    </div>
  )
}
