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
import MessagePreview from "../chat/MessagePreview"
import useSocket from "@/hooks/useSocket/useSocket"
import { deleteDirectMsg } from "@/actions/directMessageActions"
import DirectMessagePreview from "../chat/DirectMessagePreview"

export default function DeleteDirectMessageModal() {
  const router = useRouter()
  const { isOpen, type, data, close } = useModal()
  const { socket } = useSocket()
  const [loading, setLoading] = useState(false)

  const isModalOpen = isOpen && type === "DeleteDirectMessage"
  const { profile, directMessage, conversation } = data
  const message = directMessage

  const deleteMessageHandler = async () => {
    if (!message || !profile || !conversation) return
    setLoading(true)
    const deletedMsg = await deleteDirectMsg({
      messageId: message.id,
      conversationId: conversation.id,
      profileId: profile.id,
    })

    if (deletedMsg) {
      router.refresh()
      socket?.emit("message:update", { message: deletedMsg })
    }
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
            {message && <DirectMessagePreview message={message} />}
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
