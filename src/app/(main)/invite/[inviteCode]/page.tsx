import { getCurrentProfile } from "@/actions/profileActions"
import {
  getServerByInviteCode,
  getServerMembers,
  joinServer,
} from "@/actions/serverActions"
import { redirect } from "next/navigation"

type InvitePageProps = {
  params: {
    inviteCode: string
  }
}

async function InvitePage({ params }: InvitePageProps) {
  const inviteCode = params.inviteCode
  if (!inviteCode) return redirect("/")

  const profile = await getCurrentProfile()
  if (!profile) return redirect("/")

  const server = await getServerByInviteCode(inviteCode)
  if (!server) return redirect("/servers")

  const members = await getServerMembers(server.id)

  const isUserAlreadyOnServer = members?.find(
    (member) => member.id === profile.id,
  )

  if (isUserAlreadyOnServer) return redirect(`/servers/${server.id}`)

  const joinedServer = await joinServer(server.id, profile.id)
  if (!joinedServer) return redirect("/")

  return redirect(`/servers/${joinedServer.id}`)
}

export default InvitePage
