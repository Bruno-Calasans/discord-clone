import type { MemberWithProfile } from "@/types/MemberProfile";
import type { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import ActionTooltip from "../custom/ActionTooltip";
import { File } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import dateFormat from "@/utils/dateFormat";
import ICON_ROLE_MAP from "@/constants/iconRoleMap";

type MessagePreviewProps = {
  message: MessageWithMemberProfile;
};

export default function MessagePreview({ message }: MessagePreviewProps) {
  const member = message.member;
  const isEdited =
    differenceInSeconds(message.createdAt, message.updatedAt) !== 0;
  const fileType = message.fileUrl?.split(".").pop();
  const isPdf = fileType === "pdf";
  const isImage = fileType !== "pdf";

  return (
    <div className="group relative flex w-full items-start gap-2 rounded-sm bg-zinc-200 px-2 pb-4 pt-2">
      {/* Message sender's avatar */}
      <Avatar className="mt-1 h-6 w-6">
        <AvatarImage src={member.profile.imgUrl} className="rounded-full" />
      </Avatar>

      {/* Message  informations */}
      <div className="group flex w-full flex-col overflow-hidden">
        <div className="mb-[4px] flex flex-col">
          <div className="flex items-center gap-1 text-sm ">
            <div className="flex items-center gap-[2px]">
              <p className="font-semibold">{member.name}</p>
              <ActionTooltip label={member.role}>
                {ICON_ROLE_MAP[member.role]}
              </ActionTooltip>
            </div>

            <p className="text-xs text-zinc-700">
              {dateFormat(message.createdAt)}
            </p>
          </div>
        </div>

        {/* Text content */}
        {!message.deleted && message.content && (
          <div className="flex flex-col gap-1">
            <p className="text-ellipsis text-sm text-zinc-900">
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
            className="relative flex aspect-square h-52 w-52 items-center overflow-hidden rounded-md border bg-zinc-400/50"
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
          <div className="flex rounded-sm bg-zinc-300 p-2">
            <div className="w-full">
              <div className="flex w-full items-center gap-1">
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
  );
}
