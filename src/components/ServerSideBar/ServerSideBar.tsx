import ServerSideBarHeader from "./ServerSideBarHeader"
import ServerSearch from "./ServerSearch"
import ServerSection from "./ServerSection"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import type { Member, Profile } from "../../../prisma/output"
import { cn } from "./../../utils/cn"
import { MemberWithProfile } from "@/types/MemberProfile"

type ServerSideBarProps = {
  server: ServerWithMembersAndProfile
  profile: Profile
  member: MemberWithProfile
  classname?: string
}

export default function ServerSideBar({
  server,
  profile,
  member,
  classname,
}: ServerSideBarProps) {
  return (
    <aside
      className={cn(
        "grow-1 flex h-full w-[250px] flex-col dark:bg-zinc-900 max-md:hidden",
        classname,
      )}
    >
      <ServerSideBarHeader server={server} profile={profile} member={member} />
      <ServerSearch server={server} />
      <ServerSection server={server} member={member} />
      {/* //todo */}
      <div>Midia Control</div>
    </aside>
  )
}
