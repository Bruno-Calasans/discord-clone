import profileController from "@/controlllers/ProfileController"
import serverController from "@/controlllers/ServerController"
import { redirect } from "next/navigation"

export default async function Home() {
  const profile = await profileController().createInitialProfile()

  if (!profile) {
    return <div>You are not logged in</div>
  }

  const servers = await serverController().getServersByProfileId(profile.id)

  if (servers && servers.length > 0) {
    const firstServer = servers[0]
    return redirect(`/server/${firstServer.id}`)
  }

  return <div>Welcome, {profile.username}</div>
}
