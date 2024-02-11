import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { User } from "lucide-react"

type UserAvatarProps = {
  imageUrl: string
  alt: string
}

export default function UserAvatar({ imageUrl, alt }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8 cursor-pointer rounded-full ">
      <AvatarImage className="rounded-full" src={imageUrl} alt={alt} />
      <AvatarFallback
        asChild
        className="flex flex-1 items-center justify-center rounded-full"
      >
        <User className="h-full w-full bg-zinc-600 p-[2px] text-white" />
      </AvatarFallback>
    </Avatar>
  )
}
