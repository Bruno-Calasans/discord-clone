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
      socket?.emit("message:update", { message: deletedMsg } as any)
    }
    setLoading(false)
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold capitalize text-indigo-600">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-md flex flex-col gap-2 py-3 font-semibold text-zinc-900">
            <p>Are you sure you want to delete this message?</p>
            {message && <DirectMessagePreview message={message} />}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-between">
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
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              {loading ? "Deleting message..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
