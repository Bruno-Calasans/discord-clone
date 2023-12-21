"use client"
import type { ServerMembersProfile } from "@/types/ServerMembersProfile"
import type { Member } from "../../../prisma/output"
import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Settings,
  Users,
  PlusCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu"
import { useState } from "react"

type ServerHeaderProps = {
  server: ServerMembersProfile
  member: Member
}

function ServerSideBarHeader({ server, member }: ServerHeaderProps) {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((curr) => !curr)
  }

  return (
    <DropdownMenu open={open} onOpenChange={toggleOpen}>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <button className="flex w-full justify-between items-center font-semibold text-sm dark:bg-zinc-900 h-12 border-b-2 dark:border-neutral-800 px-2 hover:bg-zinc-900/20 transition">
          <p>{server.name}</p>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-2 p-2 dark:bg-zinc-950 w-[190px] rounded-sm dark:text-white text-sm">
        <DropdownMenuItem className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 text-indigo-700 hover:dark:bg-zinc-900 transition">
          Invite People
          <UserPlus className="h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition">
          Server Settings
          <Settings className="h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition">
          Manage members
          <Users className="h-4 w-4" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-between px-3 py-2 dark:bg-zinc-950 focus:outline-none font-semibold cursor-pointer rounded-l rounded-r hover:bg-zinc-200 hover:dark:bg-zinc-900 transition">
          Create channel
          <PlusCircle className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerSideBarHeader
