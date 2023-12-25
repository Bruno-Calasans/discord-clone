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
} from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import useModal from "@/hooks/useModal/useModal"
import { getServerMembers } from "@/actions/serverActions"

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
        <button className="flex w-full justify-between items-center font-semibold text-sm dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 px-2 hover:bg-zinc-900/20 transition">
          <p>{server.name}</p>
          {opened ? <ChevronUp /> : <ChevronDown />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-2 p-2 dark:bg-zinc-950 w-[190px] rounded-sm dark:text-white text-sm">
        {member.role === "admin" && (
          <>
            <DropdownMenuItem
              onClick={openInviteModalHandler}
              className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 text-indigo-700 hover:dark:bg-zinc-900 transition"
            >
              Invite People
              <UserPlus className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={openEditServerModalHandler}
              className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition"
            >
              Server Settings
              <Settings className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openManageMembersModalHandler}
              className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition"
            >
              Manage members
              <Users className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={openCreateChannelModalHandler}
              className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition"
            >
              Create channel
              <PlusCircle className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="border-[1px]" />

            <DropdownMenuItem
              onClick={openDeleteServerModalHandler}
              className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition text-rose-500"
            >
              Delete Server
              <Trash className="h-4 w-4" />
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          onClick={openLeaveServerModalHandler}
          className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition text-rose-500"
        >
          Leave Server
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerSideBarHeader
