"use client"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { differenceInSeconds } from "date-fns"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import {
  File,
  MoreHorizontal,
  Trash,
  Reply,
  Edit2,
  Copy,
  SmileIcon,
} from "lucide-react"
import ActionTooltip from "@/components/custom/ActionTooltip"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import useModal from "@/hooks/useModal/useModal"
import dateFormat from "@/utils/dateFormat"
import useSocket from "@/hooks/useSocket/useSocket"
import { Profile } from "../../../prisma/output"
import { DmWithProfileConversation } from "@/types/DmWithProfileConversation"
import { editDirectMsg } from "@/actions/directMessageActions"

const messageFormSchema = z.object({
  content: z
    .string()
    .min(1, "Message content must have at least 1 character long"),
})

type MessageEditInputs = z.infer<typeof messageFormSchema>

type DmMessageProps = {
  currentProfile: Profile
  message: DmWithProfileConversation
}

export default function DmMessage({ message, currentProfile }: DmMessageProps) {
  const [editing, setEditing] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const { open } = useModal()
  const { socket } = useSocket()
  const router = useRouter()
  const form = useForm<MessageEditInputs>({
    defaultValues: {
      content: message.content,
    },
  })

  const messageProfile = message.profile
  const isOwner = currentProfile.id === messageProfile.id
  const isEdited =
    differenceInSeconds(message.createdAt, message.updatedAt) !== 0

  const canDeleteMsg = !message.deleted && isOwner
  const canEditMsg = !message.deleted && isOwner && !message.fileUrl

  const fileType = message.fileUrl?.split(".").pop()
  const isPdf = fileType === "pdf"
  const isImage = fileType !== "pdf"
  const isLoading = form.formState.isSubmitting

  const addReactionHandler = () => {
    // todo
  }

  const replyHandler = () => {
    // todo
  }

  const startEditHandler = () => {
    setEditing(true)
    form.setFocus("content")
  }

  const cancelEditHandler = () => {
    setEditing(false)
  }

  const saveEditHandler = async ({ content }: MessageEditInputs) => {
    if (content || message.content !== content) {
      const editedMessage = await editDirectMsg({
        content,
        messageId: message.id,
        profileId: currentProfile.id,
      })

      if (editedMessage) {
        router.refresh()
        socket?.emit("message:update", { message: editedMessage })
      }
    }
    setEditing(false)
  }

  const deleteMsgHandler = () => {
    open("DeleteChannelMessage", { directMessage: message })
  }

  const copyMessageHandler = () => {
    if (message.deleted) return
    let content = message.content || message.fileUrl
    if (content) navigator.clipboard.writeText(content)
  }

  const dropdownHandler = (open: boolean) => {
    setShowMore(open)
  }

  // Cancel editing keyboard events
  useEffect(() => {
    const cancelEdit = async ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        cancelEditHandler()
      }
    }
    window.addEventListener("keydown", cancelEdit)

    return () => {
      window.removeEventListener("keydown", cancelEdit)
    }
  }, [])

  return (
    <div className="flex gap-2 w-full items-start hover:bg-zinc-200/30 hover:dark:bg-zinc-700/30 px-2 pt-2 pb-4 rounded-sm cursor-pointer relative group">
      {/* Message sender's avatar */}
      <Avatar className="w-6 h-6 mt-1 cursor-pointer">
        <AvatarImage src={messageProfile.imgUrl} />
      </Avatar>

      {/* Content and informations */}
      <div className="group flex flex-col overflow-hidden w-full cursor-pointer">
        <div className="flex flex-col mb-[4px]">
          <div className="flex gap-1 items-center text-sm ">
            <div className="flex items-center gap-[4px]">
              {/* Message informations */}
              <p className="font-semibold hover:underline cursor-pointer transition">
                {messageProfile.username}
              </p>
              {/* <ActionTooltip label={messageProfile.role}>
                {ICON_ROLE_MAP[messageProfile.role]}
              </ActionTooltip> */}
            </div>

            <p className="text-zinc-700 dark:text-zinc-400 text-xs">
              {dateFormat(message.createdAt)}
            </p>
          </div>
        </div>

        {/* Deleted Message */}
        {message.deleted && (
          <div className="flex flex-col gap-1">
            <p className="text-sm dark:text-zinc-500 text-ellipsis italic">
              {message.content}
            </p>
          </div>
        )}

        {/* No editing content */}
        {!message.deleted && message.content && !editing && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-zinc-900 dark:text-zinc-300 text-ellipsis">
              {message.content}{" "}
              {isEdited && !message.deleted && (
                <span className="text-zinc-500">(edited)</span>
              )}
            </p>
          </div>
        )}

        {/* Editing content */}
        {!message.deleted && message.content && editing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveEditHandler)}
              className="flex flex-col w-full gap-2"
              autoFocus
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        autoFocus={editing}
                        className="bg-zinc-600/30 focus-visible:ring-0 focus-visible:ring-offset-0 border-none border-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-1 w-full justify-between">
                <p className="text-sm text-zinc-400">
                  Press <span className="text-indigo-500">Escape</span> to
                  cancel
                </p>
                <div className="flex gap-2">
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
              </div>
            </form>
          </Form>
        )}

        {/* Image Content */}
        {!message.deleted && message.fileUrl && isImage && (
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
        {!message.deleted && message.fileUrl && isPdf && (
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

      {/* Reply Quick Action */}
      {!message.deleted && (
        <button
          onClick={replyHandler}
          className={cn(
            "text-white absolute right-[65px] top-[-10px] hover:dark:bg-zinc-700 bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 rounded-s invisible group-hover:visible transition p-1",
            !canEditMsg && "right-[35px]"
          )}
        >
          <ActionTooltip label="Reply">
            <Reply className="h-4 w-4" />
          </ActionTooltip>
        </button>
      )}

      {/* Edit Quick Action */}
      {!message.deleted && canEditMsg && (
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
      )}

      {/* More Actions */}
      {!message.deleted && (
        <div
          className={cn(
            "text-white absolute right-[5px] top-[-10px] hover:dark:bg-zinc-700 bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 rounded-s transition p-1",
            showMore && "visible",
            !showMore && "invisible group-hover:visible"
          )}
        >
          <DropdownMenu onOpenChange={dropdownHandler}>
            <ActionTooltip label="More">
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
            </ActionTooltip>
            <DropdownMenuContent
              align="start"
              side="left"
              alignOffset={-5}
              sideOffset={8}
              className="flex flex-col gap-1 p-2"
            >
              {/* Reply Action */}
              <DropdownMenuItem>
                <button
                  onClick={replyHandler}
                  className="flex items-center gap-1 text-sm"
                >
                  <Reply className="h-4 w-4" /> <span>Reply</span>
                </button>
              </DropdownMenuItem>

              {/* Edit Action */}
              {canEditMsg && (
                <DropdownMenuItem>
                  <button
                    onClick={startEditHandler}
                    className="flex items-center gap-1 text-sm"
                  >
                    <Edit2 className="h-4 w-4" /> <span>Edit</span>
                  </button>
                </DropdownMenuItem>
              )}

              {/* Addd Reaction Action */}
              <DropdownMenuItem>
                <button
                  onClick={addReactionHandler}
                  className="flex items-center gap-1 text-sm"
                >
                  <SmileIcon className="h-4 w-4" /> <span>Add reaction</span>
                </button>
              </DropdownMenuItem>

              {/* Copy ACtion */}
              <DropdownMenuItem>
                <button
                  onClick={copyMessageHandler}
                  className="flex items-center gap-1 text-sm"
                >
                  <Copy className="h-4 w-4" /> <span>Copy</span>
                </button>
              </DropdownMenuItem>

              {/* Delete Action */}
              {canDeleteMsg && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      onClick={deleteMsgHandler}
                      className="flex items-center gap-1 text-sm text-rose-500"
                    >
                      <Trash className="h-4 w-4" /> <span>Delete</span>
                    </button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
