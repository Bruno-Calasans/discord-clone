"use client"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import type { Member, Profile } from "../../../prisma/output"
import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Settings,
  Users,
  PlusCircle,
  Trash,
  LogOut,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu"
import { useState } from "react"
import useModal from "@/hooks/useModal/useModal"

type ServerHeaderProps = {
  server: ServerWithMembersAndProfile
  profile: Profile
  member: Member
}

function ServerSideBarHeader({ server, profile, member }: ServerHeaderProps) {
  const { open } = useModal()
  const [opened, setOpened] = useState(false)

  const toggleOpen = () => {
    setOpened((curr) => !curr)
  }

  const openInviteModalHandler = () => {
    open("Invite", { server })
  }

  const openEditServerModalHandler = () => {
    open("EditServer", { server })
  }

  const openManageMembersModalHandler = async () => {
    open("ManageMembers", { server, profile })
  }

  const openCreateChannelModalHandler = async () => {
    open("CreateChannel", { server, profile })
  }

  const openLeaveServerModalHandler = async () => {
    open("LeaveServer", { server })
  }

  const openDeleteServerModalHandler = async () => {
    open("DeleteServer", { server })
  }

  return (
    <DropdownMenu open={opened} onOpenChange={toggleOpen}>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="flex h-12 w-full items-center justify-between border-b-2 px-2 text-sm font-semibold transition hover:bg-zinc-900/20 dark:border-neutral-800 dark:bg-zinc-900">
          <p>{server.name}</p>
          {opened ? <ChevronUp /> : <ChevronDown />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex w-[190px] flex-col gap-2 rounded-sm p-2 text-sm dark:bg-zinc-950 dark:text-white">
        {member.role === "admin" && (
          <>
            <DropdownMenuItem
              onClick={openInviteModalHandler}
              className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold text-indigo-700 transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
            >
              Invite People
              <UserPlus className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={openEditServerModalHandler}
              className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
            >
              Server Settings
              <Settings className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openManageMembersModalHandler}
              className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
            >
              Manage members
              <Users className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={openCreateChannelModalHandler}
              className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
            >
              Create channel
              <PlusCircle className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="border-[1px]" />

            <DropdownMenuItem
              onClick={openDeleteServerModalHandler}
              className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold text-rose-500 transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
            >
              Delete Server
              <Trash className="h-4 w-4" />
            </DropdownMenuItem>
          </>
        )}

        {member.role !== "admin" && (
          <DropdownMenuItem
            onClick={openLeaveServerModalHandler}
            className="flex cursor-pointer justify-between rounded-l rounded-r px-3 py-2 font-semibold text-rose-500 transition hover:bg-zinc-200 focus:outline-none dark:bg-zinc-950 hover:dark:bg-zinc-900"
          >
            Leave Server
            <LogOut className="h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerSideBarHeader
