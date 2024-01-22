import { Profile } from "../../../prisma/output"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"

type ChatHeaderProps = {
  profile: Profile
}

export default function DMChatHeader({ profile }: ChatHeaderProps) {
  return (
    <div className="flex h-12 w-full items-center  gap-2 border-b-2 p-3 transition dark:border-neutral-800 dark:bg-zinc-900">
      <Avatar className="h-8 w-8">
        <AvatarImage src={profile.imgUrl} />
      </Avatar>
      <p className="text-md font-semibold capitalize ">{profile.username}</p>
    </div>
  )
}
