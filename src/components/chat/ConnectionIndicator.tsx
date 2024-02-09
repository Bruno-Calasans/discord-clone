"use client"
import useSocket from "@/hooks/useSocket/useSocket"
import { Badge } from "@/components/ui/Badge"

export default function ConnectionIndicator() {
  const { connected } = useSocket()

  if (!connected) {
    return (
      <Badge variant="outline" className="text-rose-500">
        Real time: off
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="text-emerald-500">
      Real time: on
    </Badge>
  )
}
