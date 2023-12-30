"use client"

import { useParams } from "next/navigation"

export default function ChannelPage() {
  const params = useParams()
  const channelId = params.channelId

  return <div>Channel Page {channelId}</div>
}
