"use client"

import { cn } from "@/utils/cn"
import type { MemberWithProfile } from "@/types/MemberProfile"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/ContextMenu"
import UserAvatar from "../custom/UserAvatar"
import RoleDropdown from "@/components/custom/RoleDropdown"
import KickMemberButton from "../custom/KickMemberButton"
import BanMemberButton from "../custom/BanMemberButton"
import SeeProfileMemberButton from "../custom/SeeProfileButton"
import AddFriendButton from "../custom/AddFriendButton"
import CreateDmButton from "../custom/CreateDmButton"

type MemberItemProps = {
  currentMember: MemberWithProfile
  members: MemberWithProfile[]
  label: React.ReactNode
}

export default function MembersCategory({
  currentMember,
  members,
  label,
}: MemberItemProps) {
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
                >
                  <UserAvatar
                    imageUrl={member.profile.imgUrl}
                    alt={member.name}
                  />
                  <p className="truncate">{member.name}</p>
                </div>
              </ContextMenuTrigger>

              {/* Admin Actions */}
              <ContextMenuContent className="flex flex-col gap-1 p-2">
                {member.profileId !== currentMember.profileId &&
                  currentMember.role === "admin" && (
                    <>
                      <ContextMenuItem asChild className="flex gap-1 p-1">
                        <>
                          <KickMemberButton member={member} />
                        </>
                      </ContextMenuItem>
                      <ContextMenuItem asChild className="flex gap-1 p-1">
                        <>
                          <BanMemberButton member={member} />
                        </>
                      </ContextMenuItem>
                      <ContextMenuItem asChild>
                        <>
                          <RoleDropdown member={member} />
                        </>
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}

                {/* Non-personal Public actions */}
                {member.profileId !== currentMember.profileId && (
                  <>
                    <ContextMenuItem className="flex gap-1 p-1">
                      <CreateDmButton
                        currentProfile={currentMember.profile}
                        otherProfile={member.profile}
                      />
                    </ContextMenuItem>

                    <ContextMenuItem asChild className="flex gap-1 p-1">
                      <AddFriendButton member={member} />
                    </ContextMenuItem>
                  </>
                )}
                {/* Public actions */}
                <ContextMenuItem asChild className="flex gap-1 p-1">
                  <SeeProfileMemberButton member={member} />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    </div>
  )
}
