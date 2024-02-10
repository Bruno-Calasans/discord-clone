"use client"

import { UsersRound } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"
import useHide from "@/hooks/useHide/useHide"

export default function MembersToggle() {
  const hideStore = useHide()
  if (!hideStore) return null

  const { toggle, showServerMembers } = hideStore

  const toggleMembersVisibility = () => {
    toggle("showServerMembers")
  }

  return (
    <ActionTooltip label={showServerMembers ? "Hide members" : "Show members"}>
      <button onClick={toggleMembersVisibility}>
        <UsersRound className="h-6 w-6" />
      </button>
    </ActionTooltip>
  )
}
