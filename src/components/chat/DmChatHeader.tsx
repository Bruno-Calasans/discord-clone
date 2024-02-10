import { Profile } from "../../../prisma/output"
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles"
import UserAvatar from "../custom/UserAvatar"
import DmMobileMenuToggle from "./DmMobileMenuToggle"
import DmCall from "./DmCall"

type ChatHeaderProps = {
  conversation: ConversationWithProfiles
  currentProfile: Profile
  otherProfile: Profile
}

export default function DMChatHeader({
  conversation,
  currentProfile,
  otherProfile,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col border-b-2  dark:border-neutral-800 dark:bg-zinc-900">
      <div className="relative flex h-fit w-full items-center  justify-between gap-2 p-2 px-4 transition ">
        {/* Profile name and img */}
        <div className="flex items-center gap-1">
          <DmMobileMenuToggle />
          <UserAvatar
            imageUrl={otherProfile.imgUrl}
            alt={otherProfile.username}
          />
          <p className="text-md font-semibold capitalize ">
            {otherProfile.username}
          </p>
        </div>
        <DmCall
          currentProfile={currentProfile}
          otherProfile={otherProfile}
          conversation={conversation}
        />
      </div>
    </div>
  )
}
