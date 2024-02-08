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
import { findOrCreateConversation } from "@/actions/conversationActions"
import { useRouter } from "next/navigation"
import UserAvatar from "../custom/UserAvatar"

type MemberItemProps = {
  label: React.ReactNode
  profileMember: MemberWithProfile
  members: MemberWithProfile[]
}

export default function MembersCategory({
  label,
  profileMember,
  members,
}: MemberItemProps) {
  const router = useRouter()

  const clickMemberHandler = (member: Member) => {}

  const createConversationHandler = async (member: Member) => {
    const conversation = await findOrCreateConversation(
      profileMember.profileId,
      member.profileId,
    )
    if (!conversation) return
    router.push(`/conversations/${conversation.id}`)
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col justify-between overflow-hidden text-xs font-semibold">
        <div className="ml-2 line-clamp-1 flex w-full truncate text-start text-sm">
          {label}
        </div>

        {/* Members */}
        <div className="item ml-1 flex flex-col gap-2 text-sm font-semibold">
          {members.map((member) => (
            <ContextMenu key={member.id}>
              <ContextMenuTrigger asChild>
                <div
                  key={member.id}
                  className={cn(
                    "hover:bg-text-700 group flex cursor-pointer items-center  gap-2 overflow-hidden  rounded-sm p-[4px] text-zinc-600 transition hover:bg-zinc-700 hover:text-zinc-100 dark:text-zinc-400 hover:dark:text-zinc-200",
                  )}
                  onClick={() => clickMemberHandler(member)}
                >
                  <UserAvatar
                    imageUrl={member.profile.imgUrl}
                    alt={member.name}
                  />
                  <p className="truncate">{member.name}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="p-2">
                {member.profileId !== profileMember.profileId &&
                  profileMember.role === "admin" && (
                    <>
                      <ContextMenuItem>Kick</ContextMenuItem>
                      <ContextMenuItem>Ban</ContextMenuItem>
                      <ContextMenuItem>Change Role</ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}
                <ContextMenuItem
                  onClick={() => createConversationHandler(member)}
                >
                  Direct message
                </ContextMenuItem>
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
