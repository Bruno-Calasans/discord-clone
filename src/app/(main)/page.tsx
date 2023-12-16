"use client"
import * as profileActions from "@/actions/profileActions"
import * as serverActions from "@/actions/serverActions"
import { redirect, useRouter } from "next/navigation"
import CreateServerForm from "@/components/custom/CreateServerForm"
import { useEffect, useState } from "react"
import type { Profile } from "../../../prisma/output"
import Header from "@/components/layout/Header"

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  const loadProfile = async () => {
    // getting profile
    const profile = await profileActions.createInitialProfile()

    if (!profile) return
    const servers = await serverActions.getServersByProfileId(profile.id)

    // getting start servers
    if (servers && servers.length > 0) {
      const firstServer = servers[0]
      return router.replace(`/servers/${firstServer.id}`)
    }
    setProfile(profile)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  if (!profile) {
    return null
  }

  return (
    <main>
      <Header />
      <CreateServerForm onSubmit={console.log} />
    </main>
  )
}
