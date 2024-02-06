import { getCurrentProfile } from "@/actions/profileActions"
import { redirect } from "next/navigation"
import {
  getCompleteServer,
  getServersByProfileId,
} from "@/actions/serverActions"
import ServerSideBar from "@/components/ServerSideBar/ServerSideBar"
import MembersSideBar from "@/components/MembersSideBar/MembersSideBar"

type ServerLayoutProps = {
  children: React.ReactNode
  params: { serverId: string }
}

export async function generateMetadata({ params }: ServerLayoutProps) {
  const serverId = params.serverId
  if (!serverId) return

  const profile = await getCurrentProfile()
  if (!profile) return

  const server = await getCompleteServer(serverId)
  if (!server) return

  return {
    title: server.name,
    icons: {
      icon: server.imgUrl,
    },
  }
}

export default async function ServerLayout({
  children,
  params,
}: ServerLayoutProps) {
  const serverId = params.serverId

  // cheking if user is logged in
  const profile = await getCurrentProfile()
  if (!profile) return redirect(`/`)

  // checking is server is found
  const server = await getCompleteServer(serverId)
  if (!server) return redirect(`/servers`)

  // Checking is user is member of this server
  const member = server.members.find(
    (member) => member.profileId === profile.id,
  )
  if (!member) return redirect(`/`)

  // getting all servers of the user
  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect(`/`)

  // checking if user is currently on this server
  const isUserOnServer = servers.find(
    (userServer) => userServer.id === server.id,
  )
  if (!isUserOnServer) return redirect(`/`)

  return (
    <>
      <ServerSideBar server={server} profile={profile} member={member} />
      {children}
      <MembersSideBar profile={profile} members={server.members} />
    </>
  )
}
