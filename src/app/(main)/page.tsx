import { createInitialProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import InitialCreateServerModal from "@/components/modals/InitialCreateServerModal"
import { redirect } from "next/navigation"
import Mount from "@/components/custom/Mount"

export default async function Home() {
  // getting profile
  const profile = await createInitialProfile()
  if (!profile) return redirect("/")

  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  // getting start server
  if (servers.length > 0) {
    const firstServer = servers[0]
    return redirect(`/servers/${firstServer.id}`)
  }

  return (
    <main>
      <Mount>
        <InitialCreateServerModal />
      </Mount>
    </main>
  )
}
