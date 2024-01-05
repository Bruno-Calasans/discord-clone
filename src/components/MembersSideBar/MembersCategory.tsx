"use client"
import { cn } from "@/utils/cn"
import type { Member } from "../../../prisma/output"
import type { MemberWithProfile } from "@/types/MemberProfile"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/ContextMenu"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"

type MemberItemProps = {
  label: React.ReactNode
  profileMember: MemberWithProfile
  members: MemberWithProfile[]
  onClickMember: (member: Member) => void
}

export default function MembersCategory({
  label,
  profileMember,
  members,
  onClickMember,
}: MemberItemProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between font-semibold text-xs mt-3 overflow-hidden">
        <p className="flex w-full text-start text-sm line-clamp-1 ml-2 mb-2">
          {label}
        </p>

        {/* members */}
        <div className="font-semibold text-sm flex flex-col gap-2 item  overflow-hidden ml-2 mr-1">
          {members.map((member) => (
            <ContextMenu key={member.id}>
              <ContextMenuTrigger>
                <div
                  key={member.id}
                  className={cn(
                    "group flex gap-2 items-center hover:bg-text-700 text-zinc-600 hover:text-zinc-100 dark:text-zinc-400 hover:dark:text-zinc-200 cursor-pointer p-[4px] hover:bg-zinc-700 rounded-sm transition "
                  )}
                  onClick={() => onClickMember(member)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.profile.imgUrl} />
                  </Avatar>
                  <p className="line-clamp-1">{member.name}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {member.profileId !== profileMember.profileId &&
                  profileMember.role === "admin" && (
                    <>
                      <ContextMenuItem>Kick</ContextMenuItem>
                      <ContextMenuItem>Ban</ContextMenuItem>
                      <ContextMenuItem>Change Role</ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}
                <ContextMenuItem>Direct message</ContextMenuItem>
                <ContextMenuItem>See profile</ContextMenuItem>
                <ContextMenuItem>Add friend</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  )
}
