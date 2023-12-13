"use client"
import * as profileActions from "@/actions/profileActions"
import * as serverActions from "@/actions/serverActions"
import { redirect } from "next/navigation"
import CreateServerForm from "@/components/custom/CreateServerForm"
import { useEffect, useState } from "react"
import type { Profile } from "../../../prisma/output"

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)

  const loadProfile = async () => {
    const profile = await profileActions.createInitialProfile()
    setProfile(profile)
  }

  const loadStartServer = async () => {
    if (!profile) return

    const servers = await serverActions.getServersByProfileId(profile.id)

    if (servers && servers.length > 0) {
      const firstServer = servers[0]
      return redirect(`/server/${firstServer.id}`)
    }
  }

  useEffect(() => {
    loadProfile()
    loadStartServer()
  }, [])

  if (!profile) {
    return null
  }

  console.log(profile)

  return <CreateServerForm onSubmit={console.log} />
}
