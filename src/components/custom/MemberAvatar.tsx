import { AvatarImage, Avatar } from "@/components/ui/Avatar"
import type { MemberWithProfile } from "@/types/MemberProfile"
import {
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Check,
  Loader,
} from "lucide-react"
import { cn } from "@/utils/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/DropdownMenu"
import { changeMemberRole, kickMember } from "@/actions/memberActions"
import { useState } from "react"
import type { Profile } from "../../../prisma/output"

const iconRoleMap = {
  admin: <ShieldAlert className="h-4 w-4 text-red-500" />,
} as Record<string, JSX.Element>

type MemberAvatarProps = {
  member: MemberWithProfile
  profile: Profile
  onRoleChange?: (member: MemberWithProfile, role: string) => void
  onKick?: (member: MemberWithProfile) => void
  onBan?: (member: MemberWithProfile) => void
  onChange: () => void
}

export default function MemberAvatar({
  member,
  profile,
  onRoleChange,
  onKick,
  onChange,
}: MemberAvatarProps) {
  const [loading, setLoading] = useState(false)
  const roles = ["admin", "guest"]

  const roleChangeHandler = async (role: string) => {
    if (member.role === role) return
    setLoading(true)
    await changeMemberRole(member.id, role)
    setLoading(false)
    if (onRoleChange) onRoleChange(member, role)
    onChange()
  }

  const kickMemberHandler = async () => {
    setLoading(true)
    await kickMember(member.id)
    setLoading(false)
    if (onKick) onKick(member)
    onChange()
  }

  const banMemberHandler = async () => {
    console.log(`Banning ${member.name}...`)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Avatar className="w-10 h-10">
          <AvatarImage src={member.profile.imgUrl} />
        </Avatar>

        <div>
          <div className="flex gap-1 items-center">
            <p className="text-sm font-bold text-zinc-700 hover:underline cursor-pointer transition-all">
              {member.name}
            </p>
            {iconRoleMap[member.role]}
          </div>
          <p className="text-sm">{member.profile.email}</p>
        </div>
      </div>
      {loading && <Loader className="animate-spin text-zinc-500 w-4 h-4" />}
      {!loading && profile.id !== member.profileId && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuLabel>Member actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* role submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex justify-center items-center gap-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Role</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => roleChangeHandler(role)}
                  >
                    <div className="flex justify-between items-center gap-1 w-full">
                      <div className="flex items-center gap-1">
                        {member.role === role ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <Shield
                            className={cn(
                              "h-4 w-4",
                              member.role === role &&
                                "fill-black dark:fill-white"
                            )}
                          />
                        )}
                        <span>{role}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Other actions */}
            <DropdownMenuItem onClick={kickMemberHandler}>
              Kick
            </DropdownMenuItem>
            <DropdownMenuItem onClick={banMemberHandler}>Ban</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
