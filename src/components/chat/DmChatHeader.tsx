import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"

type ChatHeaderProps = {
  profile: Profile
}

export default function DMChatHeader({ profile }: ChatHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2  dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 p-3 transition">
      <Avatar className="w-8 h-8">
        <AvatarImage src={profile.imgUrl} />
      </Avatar>
      <p className="text-md capitalize font-semibold ">{profile.username}</p>
    </div>
  )
}
