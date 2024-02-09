"use client"

import { Shield, ShieldCheck, ChevronRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/DropdownMenu"
import { MemberWithProfile } from "@/types/MemberProfile"
import { cn } from "@/utils/cn"
import { useState } from "react"
import { changeMemberRole } from "@/actions/memberActions"
import { useRouter } from "next/navigation"

type RoleDropDownProps = {
  label?: React.ReactNode
  member: MemberWithProfile
  onChange?: () => void
}

export default function RoleDropdown({
  label,
  member,
  onChange,
}: RoleDropDownProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const roles = ["admin", "guest"]

  const roleChangeHandler = async (member: MemberWithProfile, role: string) => {
    if (member.role === role) return
    setLoading(true)
    await changeMemberRole(member.id, role)
    setLoading(false)
    router.refresh()
    if (onChange) onChange()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading} asChild>
        {label ?? (
          <button className="flex w-full items-center justify-between gap-1 rounded-md p-1 text-sm hover:bg-stone-800">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Role</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={8}>
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            asChild
            onClick={() => roleChangeHandler(member, role)}
          >
            <button className="flex w-full items-center justify-between gap-1 text-sm">
              <div className="flex items-center gap-1">
                {member.role === role ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <Shield
                    className={cn(
                      "h-4 w-4",
                      member.role === role && "fill-black dark:fill-white",
                    )}
                  />
                )}
                <span>{role}</span>
              </div>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
