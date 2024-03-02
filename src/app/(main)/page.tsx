import { createInitialProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import ServerRedirect from "@/components/RedirectPage/ServerRedirect"

export const metadata: Metadata = {
  title: "Home",
}

export default async function HomePage() {
  // getting profile
  const profile = await createInitialProfile()
  if (!profile) return redirect("/sign-up")

  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  return <ServerRedirect servers={servers} />
}
