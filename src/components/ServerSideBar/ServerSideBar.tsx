import ServerSideBarHeader from "./ServerSideBarHeader"
import ServerSearch from "./ServerSearch"
import ServerSection from "./ServerSection"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import type { Member, Profile } from "../../../prisma/output"
import { cn } from "./../../utils/cn"

type ServerSideBarProps = {
  server: ServerWithMembersAndProfile
  profile: Profile
  member: Member
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
        "flex flex-col grow-1 dark:bg-zinc-900 h-full w-[250px] max-md:hidden",
        classname
      )}
    >
      <ServerSideBarHeader server={server} profile={profile} member={member} />
      <ServerSearch server={server} />
      <ServerSection server={server} member={member} />
    </aside>
  )
}
