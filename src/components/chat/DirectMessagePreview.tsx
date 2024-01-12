import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import Image from "next/image"
import { File } from "lucide-react"
import { differenceInSeconds } from "date-fns"
import dateFormat from "@/utils/dateFormat"
import type { DmWithProfileConversation } from "@/types/DmWithProfileConversation"

type MessagePreviewProps = {
  message: DmWithProfileConversation
}

export default function DirectMessagePreview({ message }: MessagePreviewProps) {
  const profile = message.profile
  const isEdited =
    differenceInSeconds(message.createdAt, message.updatedAt) !== 0
  const fileType = message.fileUrl?.split(".").pop()
  const isPdf = fileType === "pdf"
  const isImage = fileType !== "pdf"

  return (
    <div className="flex gap-2 w-full items-start bg-zinc-200 px-2 pt-2 pb-4 rounded-sm relative group">
      {/* Message sender's avatar */}
      <Avatar className="w-6 h-6 mt-1">
        <AvatarImage src={profile.imgUrl} className="rounded-full" />
      </Avatar>

      {/* Message  informations */}
      <div className="group flex flex-col overflow-hidden w-full">
        <div className="flex flex-col mb-[4px]">
          <div className="flex gap-1 items-center text-sm ">
            <div className="flex items-center gap-[2px]">
              <p className="font-semibold">{profile.username}</p>
              {/* <ActionTooltip label={member.role}>
                {ICON_ROLE_MAP[member.role]}
              </ActionTooltip> */}
            </div>

            <p className="text-zinc-700 text-xs">
              {dateFormat(message.createdAt)}
            </p>
          </div>
        </div>

        {/* Text content */}
        {!message.deleted && message.content && (
          <div className="flex flex-col gap-1">
            <p className="text-sm text-zinc-900 text-ellipsis">
              {message.content}{" "}
              {isEdited && !message.deleted && (
                <span className="text-zinc-600">(edited)</span>
              )}
            </p>
          </div>
        )}

        {/* Image Content */}
        {!message.deleted && message.fileUrl && isImage && (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferer"
            className="relative bg-zinc-400/50 rounded-md flex items-center border h-52 w-52 aspect-square overflow-hidden"
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
          <div className="flex bg-zinc-300 rounded-sm p-2">
            <div className="w-full">
              <div className="flex items-center w-full gap-1">
                <File className="w-18 h-18 text-indigo-500" />
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferer"
                  className="text-sm uppercase text-indigo-500"
                >
                  PDF File
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
