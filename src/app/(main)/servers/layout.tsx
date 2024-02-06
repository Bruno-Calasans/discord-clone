import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import NavigationSideBar from "@/components/NavigationSideBar/NavigationSideBar"

export const metadata: Metadata = {
  title: "Servers",
}

type ServersLayoutProps = {
  children: React.ReactNode
}

export default async function ServersLayout({ children }: ServersLayoutProps) {
  const profile = await getCurrentProfile()
  if (!profile) return redirect("/sign-up")

  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  return (
    <main className="flex h-full w-full">
      <NavigationSideBar servers={servers} />
      {children}
    </main>
  )
}
