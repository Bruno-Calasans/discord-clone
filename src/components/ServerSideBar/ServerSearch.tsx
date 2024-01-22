"use client"
import type { ServerWithMembersAndProfile } from "@/types/ServerMembersProfile"
import { Search, Hash, Mic, Video, ShieldAlert, Shield } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import { useEffect, useState } from "react"
import { CHANNEL_TYPE } from "../../../prisma/output"
import { useRouter } from "next/navigation"

const channelIconMap = {
  [CHANNEL_TYPE.TEXT]: <Hash className="h-4 w-4" />,
  [CHANNEL_TYPE.AUDIO]: <Mic className="h-4 w-4" />,
  [CHANNEL_TYPE.VIDEO]: <Video className="h-4 w-4" />,
} as const

const roleIconMap = {
  admin: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  moderator: <ShieldAlert className="h-4 w-4 text-emerald-500" />,
  guest: null,
} as Record<string, JSX.Element | null>

type ServerSearchProps = {
  server: ServerWithMembersAndProfile
}

export default function ServerSearch({ server }: ServerSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const members = server.members
  const textChannels = server.channels.filter(
    (channel) => channel.type === "TEXT",
  )
  const audioChannels = server.channels.filter(
    (channel) => channel.type === "AUDIO",
  )
  const videochannels = server.channels.filter(
    (channel) => channel.type === "VIDEO",
  )

  const redirect = (id: string, type: "channel" | "member") => {
    setOpen(false)

    if (type === "member") {
      return router.push(`servers/${server.id}/conversations/${id}`)
    }

    if (type === "channel") {
      return router.push(`servers/${server.id}/channels/${id}`)
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="w-full border-b-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-700 dark:border-neutral-800 hover:dark:text-white">
      <button
        onClick={() => setOpen(true)}
        className="trasition flex w-full items-center justify-between p-2 hover:bg-zinc-700/10 hover:dark:bg-zinc-700/50"
      >
        <div className="flex items-center justify-center gap-1">
          <Search className="h-4 w-4" />
          <p>Search</p>
        </div>
        <kbd className="rounded-sm bg-muted/50 p-1">CTRL + K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for a channel or member" />
        <CommandList>
          <CommandEmpty>No channel or member found</CommandEmpty>

          {textChannels.length > 0 && (
            <CommandGroup heading="Text Channels">
              {textChannels.map((channel) => (
                <CommandItem
                  onSelect={() => redirect(channel.id, "channel")}
                  key={channel.id}
                  className="flex cursor-pointer gap-1 capitalize"
                >
                  {channelIconMap["TEXT"]}
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {audioChannels.length > 0 && (
            <CommandGroup heading="Audio Channels">
              {audioChannels.map((channel) => (
                <CommandItem
                  onSelect={() => redirect(channel.id, "channel")}
                  key={channel.id}
                  className="flex cursor-pointer gap-1 capitalize"
                >
                  {channelIconMap["AUDIO"]}
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {videochannels.length > 0 && (
            <CommandGroup heading="Video Channels">
              {videochannels.map((channel) => (
                <CommandItem
                  onSelect={() => redirect(channel.id, "channel")}
                  key={channel.id}
                  className="flex cursor-pointer gap-1 capitalize"
                >
                  {channelIconMap["VIDEO"]}
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {members.length > 0 && (
            <CommandGroup heading="Members">
              {members.map((member) => (
                <CommandItem
                  onSelect={() => redirect(member.id, "member")}
                  key={member.id}
                  className="flex cursor-pointer gap-1 capitalize"
                >
                  {roleIconMap[member.role.toLowerCase()]}
                  {member.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
