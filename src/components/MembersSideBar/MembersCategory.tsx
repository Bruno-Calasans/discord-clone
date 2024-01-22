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
import { findOrCreateConversation } from "@/actions/conversationActions"
import { useRouter } from "next/navigation"

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
    <div>
      {/* Header */}
      <div className="mt-3 flex flex-col justify-between overflow-hidden text-xs font-semibold">
        <div className="mb-2 ml-2 line-clamp-1 flex w-full text-start text-sm">
          {label}
        </div>

        {/* members */}
        <div className="item ml-2 mr-1 flex flex-col gap-2  overflow-hidden text-sm font-semibold">
          {members.map((member) => (
            <ContextMenu key={member.id}>
              <ContextMenuTrigger>
                <div
                  key={member.id}
                  className={cn(
                    "hover:bg-text-700 group flex cursor-pointer items-center gap-2 rounded-sm p-[4px] text-zinc-600 transition hover:bg-zinc-700 hover:text-zinc-100 dark:text-zinc-400 hover:dark:text-zinc-200 ",
                  )}
                  onClick={() => clickMemberHandler(member)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.profile.imgUrl} />
                  </Avatar>
                  <p className="line-clamp-1">{member.name}</p>
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
