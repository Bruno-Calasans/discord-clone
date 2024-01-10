"use client"
import useModal from "@/hooks/useModal/useModal"
import Button from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteChannelMsg } from "@/actions/messageActions"
import MessagePreview from "../chat/MessagePreview"

export default function DeleteChannelMessageModal() {
  const { isOpen, type, data, close } = useModal()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isModalOpen = isOpen && type === "DeleteChannelMessage"
  const { message } = data

  const deleteMessageHandler = async () => {
    if (!message) return

    setLoading(true)
    await deleteChannelMsg({
      messageId: message.id,
      memberId: message.member.id,
      serverId: message.member.serverId,
    })
    router.refresh()
    setLoading(false)
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center capitalize">
            Delete Message
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2 font-semibold text-md text-zinc-900 py-3">
            <p>Are you sure you want to delete this message?</p>
            {message && <MessagePreview message={message} />}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button
              disabled={loading}
              onClick={close}
              className="font-bold hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={deleteMessageHandler}
              className="text-white bg-rose-500 hover:bg-rose-600"
            >
              {loading ? "Deleting message..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
