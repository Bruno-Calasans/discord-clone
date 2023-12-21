import { getCurrentProfile } from "@/actions/profileActions"
import { getCompleteServer } from "@/actions/serverActions"
import ServerSideBarHeader from "./ServerSideBarHeader"

type ServerSideBarProps = {
  serverId: string
}

async function ServerSideBar({ serverId }: ServerSideBarProps) {
  const profile = await getCurrentProfile()
  if (!profile) return null

  const server = await getCompleteServer(serverId)
  if (!server) return null

  const member = server.members.find(
    (member) => member.profileId === profile.id
  )

  if (!member) return null

  return (
    <aside className="flex-col grow-1 dark:bg-zinc-900 w-[30%]">
      <ServerSideBarHeader server={server} member={member} />
    </aside>
  )
}

export default ServerSideBar
