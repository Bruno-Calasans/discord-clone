import ServerSideBarHeader from "./ServerSideBarHeader"
import ServerSearch from "./ServerSearch"
import ServerSection from "./ServerSection"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import type { Member, Profile } from "../../../prisma/output"

type ServerSideBarProps = {
  server: ServerWithMembersAndProfile
  profile: Profile
  member: Member
}

function ServerSideBar({ server, profile, member }: ServerSideBarProps) {
  return (
    <aside className="flex-col grow-1 dark:bg-zinc-900 w-[30%]">
      <ServerSideBarHeader server={server} profile={profile} member={member} />
      <ServerSearch server={server} />
      <ServerSection server={server} member={member} />
    </aside>
  )
}

export default ServerSideBar
