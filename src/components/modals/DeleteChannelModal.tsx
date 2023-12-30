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
import { deleteChannel } from "@/actions/channelActions"

export default function DeleteChannelModal() {
  const { isOpen, type, data, close } = useModal()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isModalOpen = isOpen && type === "DeleteChannel"
  const { channel } = data

  const deleteChannelHandler = async () => {
    if (!channel) return
    setLoading(true)
    await deleteChannel(channel.id)
    router.refresh()
    setLoading(false)
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center capitalize">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="font-semibold text-md text-zinc-900 py-3">
            Are you sure you want to delete the channel{" "}
            <span className="font-bold text-indigo-500 hover:underline cursor-pointer">
              #{channel?.name}
            </span>
            ?
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
              onClick={deleteChannelHandler}
              className="text-white bg-rose-500 hover:bg-rose-600"
            >
              {loading ? "Deleting channel..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
