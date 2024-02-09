import { AvatarImage, Avatar } from "@/components/ui/Avatar"
import type { MemberWithProfile } from "@/types/MemberProfile"
import { MoreVertical, Loader } from "lucide-react"
import { cn } from "@/utils/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu"
import { useState } from "react"
import type { Profile } from "../../../prisma/output"
import ICON_ROLE_MAP from "@/constants/iconRoleMap"
import RoleDropdown from "./RoleDropdown"
import KickMemberButton from "./KickMemberButton"
import BanMemberButton from "./BanMemberButton"
import UserAvatar from "./UserAvatar"

type ServerMembersDropmenuProps = {
  member: MemberWithProfile
  profile?: Profile
  onChange: () => void
}

export default function ServerMembersDropmenu({
  onChange,
  member,
  profile,
}: ServerMembersDropmenuProps) {
  const [loading, setLoading] = useState(false)
  const isCurrentProfile = profile?.id == member.profileId
  const isAdmin = member.role.toLowerCase() === "admin"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UserAvatar imageUrl={member.profile.imgUrl} alt={member.name} />

        <div>
          <div className="flex items-center gap-1">
            <p
              className={cn(
                "cursor-pointer text-sm font-bold text-zinc-700 transition-all hover:underline",
                isCurrentProfile && "text-indigo-500",
              )}
            >
              {member.name}
            </p>
            {ICON_ROLE_MAP[member.role]}
          </div>
          <p className="text-sm">{member.profile.email}</p>
        </div>
      </div>
      {loading && <Loader className="h-4 w-4 animate-spin text-zinc-500" />}
      {!loading && !isCurrentProfile && !isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            align="start"
            className="flex flex-col gap-1"
          >
            <DropdownMenuItem asChild disabled={loading}>
              <>
                <RoleDropdown onChange={onChange} member={member} />
              </>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <>
                <KickMemberButton onChange={onChange} member={member} />
              </>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <>
                <BanMemberButton onChange={onChange} member={member} />
              </>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
