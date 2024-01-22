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
import { leaveServer } from "@/actions/serverActions"
import { useRouter } from "next/navigation"

export default function LeaveServerModal() {
  const { isOpen, type, data, close } = useModal()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isModalOpen = isOpen && type === "LeaveServer"
  const { server } = data

  const leaveServerHandler = async () => {
    if (!server) return
    setLoading(true)
    await leaveServer(server.id)
    router.refresh()
    setLoading(false)
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold capitalize text-indigo-600">
            Leave Serve
          </DialogTitle>
          <DialogDescription className="text-md py-3 font-semibold text-zinc-900">
            You are leaving the server{" "}
            <span className="font-bold text-indigo-500">{server?.name}</span>.
            Are you sure?
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
              onClick={leaveServerHandler}
              className="bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {loading ? "Leaving server..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
