import { createInitialProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import InitialCreateServerModal from "@/components/modals/InitialCreateServerModal"
import { redirect } from "next/navigation"
import Mount from "@/components/custom/Mount"
import { currentUser } from "@clerk/nextjs"

export default async function Home() {
  //
  const user = await currentUser()
  if (!user) return redirect("/sign-up")

  // getting profile
  const profile = await createInitialProfile(user)
  if (!profile) return redirect("/sign-up")

  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  // getting start server
  if (servers.length > 0) {
    const firstServer = servers[0]
    const firstChannel = firstServer.channels[0]
    return redirect(`/servers/${firstServer.id}/channels/${firstChannel.id}`)
  }

  return (
    <main>
      <Mount>
        <InitialCreateServerModal />
      </Mount>
    </main>
  )
}
