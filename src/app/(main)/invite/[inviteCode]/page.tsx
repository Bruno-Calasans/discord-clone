import { getCurrentProfile } from "@/actions/profileActions"
import {
  getServerByInviteCode,
  getServerMembers,
  joinServer,
} from "@/actions/serverActions"
import { redirect } from "next/navigation"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Invite",
}

type InvitePageProps = {
  params: {
    inviteCode: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteCode = params.inviteCode
  if (!inviteCode) return redirect("/")

  const validInviteCode = await getServerByInviteCode(inviteCode)
  if (!validInviteCode) return redirect("/")

  const profile = await getCurrentProfile()
  if (!profile) return redirect("/sign-up")

  const server = await getServerByInviteCode(inviteCode)
  if (!server) return redirect("/")

  const members = await getServerMembers(server.id)
  if (!members) return redirect("/")

  const firstChannelId = server.channels[0].id
  const foundMember = members.find((member) => member.profileId === profile.id)
  if (foundMember)
    return redirect(`/servers/${server.id}/channels/${firstChannelId}`)

  const joinedServer = await joinServer(server.id, profile.id)
  if (!joinedServer) return redirect("/")

  return redirect(`/servers/${joinedServer.id}/channels/${firstChannelId}`)
}
