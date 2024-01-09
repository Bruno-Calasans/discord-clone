"use client"
import * as z from "zod"
import type { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile"
import { format, isToday, isYesterday, differenceInSeconds } from "date-fns"
import type { MemberWithProfile } from "@/types/MemberProfile"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import {
  ShieldAlert,
  File,
  MoreHorizontal,
  Edit,
  Trash,
  Reply,
  Edit2,
  Pin,
} from "lucide-react"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { cn } from "@/utils/cn"
import Input from "../ui/Input"
import { useForm } from "react-hook-form"
import Button from "../ui/Button"
import { deleteChannelMsg, editChannelMsg } from "@/actions/messageActions"

const messageFormSchema = z.object({
  content: z
    .string()
    .min(1, "Message content must have at least 1 character long"),
})

type MessageEditInputs = z.infer<typeof messageFormSchema>

const dateFormat = (date: string | number | Date) => {
  let day = "dd/MM/yyyy"
  let hours = "H:mm"
  const dateFormat = `${day} at ${hours}`

  const today = isToday(date)
  const yesterday = isYesterday(date)
  let readableDate = ""

  if (today) readableDate = "today"
  if (yesterday) readableDate = "yesterday"

  if (readableDate) {
    return `${readableDate} at ${format(date, hours)}`
  }

  return format(date, dateFormat)
}

type ChannelMessageProps = {
  member: MemberWithProfile
  message: MessageWithMemberProfile
}

const iconRoleMap = {
  admin: <ShieldAlert className="h-4 w-4 text-rose-600" />,
} as Record<string, JSX.Element>

export default function ChannelMessage({
  member,
  message,
}: ChannelMessageProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const form = useForm<MessageEditInputs>({
    defaultValues: {
      content: message.content,
    },
  })

  const isAdmin = member.role.toLowerCase() === "admin"
  const isOwner = member.id === message.member.id
  const isEdited =
    differenceInSeconds(message.createdAt, message.updatedAt) !== 0
  const canDeleteMsg = !message.deleted && (isOwner || isAdmin)
  const canEditMsg = !message.deleted && isOwner && !message.fileUrl
  const fileType = message.fileUrl?.split(".").pop()
  const isPdf = fileType === "pdf"
  const isImage = fileType !== "pdf"
  const isLoading = form.formState.isSubmitting

  const replyHandler = () => {
    // todo
  }

  const startEditHandler = () => {
    setEditing(true)
  }

  const cancelEditHandler = () => {
    setEditing(false)
  }

  const saveEditHandler = async ({ content }: MessageEditInputs) => {
    if (content || message.content !== content) {
      await editChannelMsg({
        content,
        messageId: message.id,
        memberId: member.id,
        serverId: member.serverId,
      })
    }
    setEditing(false)
  }

  const deleteMsgHandler = async () => {
    setDeleting(true)
    await deleteChannelMsg({
      messageId: message.id,
      memberId: member.id,
      serverId: member.serverId,
    })
    setDeleting(false)
  }

  return (
    <div className="flex gap-2 w-full items-start hover:bg-zinc-200/30 hover:dark:bg-zinc-700/30 px-2 pt-2 pb-4 rounded-sm cursor-pointer relative group">
      <Avatar className="w-6 h-6 mt-1 cursor-pointer">
        <AvatarImage src={member.profile.imgUrl} />
      </Avatar>
      <div className="group flex flex-col overflow-hidden w-full cursor-pointer">
        <div className="flex flex-col mb-[4px]">
          <div className="flex gap-1 items-center text-sm ">
            <div className="flex items-center gap-[2px]">
              <p className="font-semibold hover:underline cursor-pointer transition">
                {member.name}
              </p>
              <ActionTooltip label={member.role}>
                {iconRoleMap[member.role]}
              </ActionTooltip>
            </div>

            <p className="text-zinc-700 dark:text-zinc-400 text-xs">
              {dateFormat(message.createdAt)}
            </p>
          </div>
        </div>

        {/* No editing content */}
        {message.content && !editing && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-zinc-900 dark:text-zinc-300 text-ellipsis">
              {message.content}
            </p>

            {isEdited && (
              <p className="text-xs text-zinc-500 italic">
                Last edited: {dateFormat(message.updatedAt)}
              </p>
            )}
          </div>
        )}

        {/* Editing content */}
        {message.content && editing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveEditHandler)}
              className="flex flex-col w-full gap-2"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="bg-zinc-600/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-none border-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1 w-full justify-end">
                <Button
                  onClick={cancelEditHandler}
                  size="sm"
                  variant="primary"
                  className="h-5"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="h-5"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Image Content */}
        {message.fileUrl && isImage && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferer"
            className="relative bg-zinc-200 dark:bg-zinc-700/30 rounded-md flex items-center border h-52 w-52 aspect-square overflow-hidden"
          >
            <Image
              src={message.fileUrl}
              alt={message.content}
              fill
              className="object-cover"
            />
          </a>
        )}

        {/* Pdf Content */}
        {message.fileUrl && isPdf && (
          <div className="flex bg-zinc-200 dark:bg-zinc-700/30 rounded-sm p-2">
            <div className="w-full">
              <div className="flex items-center w-full gap-1">
                <File className="w-18 h-18 text-indigo-500" />
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferer"
                  className="text-sm uppercase text-indigo-500 hover:underline"
                >
                  PDF File
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply Action */}
      <button
        onClick={replyHandler}
        className={cn(
          "text-white absolute right-[65px] top-[-10px] hover:dark:bg-zinc-700 bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 rounded-s invisible group-hover:visible transition p-1"
        )}
      >
        <ActionTooltip label="Reply">
          <Reply className="h-4 w-4" />
        </ActionTooltip>
      </button>

      {/* Edit Action */}
      <button
        onClick={startEditHandler}
        className={cn(
          "text-white absolute right-[35px] top-[-10px] hover:dark:bg-zinc-700 bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 rounded-s invisible group-hover:visible transition p-1"
        )}
      >
        <ActionTooltip label="Edit">
          <Edit2 className="h-4 w-4" />
        </ActionTooltip>
      </button>

      {/* More Actions */}
      <div
        onClick={() => setShowMore(true)}
        className={cn(
          "text-white absolute right-[5px] top-[-10px] hover:dark:bg-zinc-700 bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 rounded-s transition p-1",
          showMore && "visible",
          !showMore && "invisible group-hover:visible"
        )}
      >
        <DropdownMenu>
          <ActionTooltip label="More">
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
          </ActionTooltip>
          <DropdownMenuContent className="flex flex-col gap-1 p-2">
            {/* <DropdownMenuItem>
              <button
                onClick={replyHandler}
                className="flex items-center gap-1 text-sm"
              >
                <Reply className="h-4 w-4" /> <span>Reply</span>
              </button>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
              <button
                onClick={startEditHandler}
                className="flex items-center gap-1 text-sm"
              >
                <Edit className="h-4 w-4" /> <span>Edit</span>
              </button>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <button
                onClick={deleteMsgHandler}
                className="flex items-center gap-1 text-sm text-rose-500"
              >
                <Trash className="h-4 w-4" /> <span>Delete</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
