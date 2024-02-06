import { getCurrentProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import ServerRedirect from "@/components/RedirectPage/ServerRedirect"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function ServersPage() {
  const profile = await getCurrentProfile()
  if (!profile) return redirectToSignIn()

  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  return <ServerRedirect servers={servers} />
}
