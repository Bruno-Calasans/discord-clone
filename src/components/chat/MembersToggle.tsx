"use client"

import useHide from "@/hooks/useHide/useHide"
import { UsersRound } from "lucide-react"
import ActionTooltip from "../custom/ActionTooltip"

export default function MembersToggle() {
  const { serverMembers, toggle } = useHide()

  const clickMembersHandler = () => {
    toggle("serverMembers")
  }

  return (
    <ActionTooltip label={serverMembers ? "Hide members" : "Show members"}>
      <button onClick={clickMembersHandler}>
        <UsersRound className="h-6 w-6" />
      </button>
    </ActionTooltip>
  )
}
