"use client"
import useModal from "@/hooks/useModal/useModal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import Label from "@/components/ui/Label"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { Copy, RefreshCcw, Check } from "lucide-react"
import { useState } from "react"
import { regenerateServerInviteCode } from "@/actions/serverActions"

export default function InviteModal() {
  const { isOpen, type, data, open, close } = useModal()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const isModalOpen = isOpen && type === "Invite"

  const currentUrl = location.origin
  const server = data.server
  const inviteLink = `${currentUrl}/invite/${server?.inviteCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const regenerateLink = async () => {
    if (!server) return
    setLoading(true)
    const updatedServer = await regenerateServerInviteCode(server.id)
    if (updatedServer) open(`Invite`, { server: updatedServer })
    setLoading(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-4xl font-bold text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-1">
          <Label className="text-bold uppercase font-semibold w-full flex flex-col gap-2">
            Invite Link
            <div className="flex gap-1">
              <Input
                className="bg-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                value={inviteLink}
                readOnly
              />
              <Button
                disabled={loading}
                variant="ghost"
                size="icon"
                onClick={copyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs capitalize text-emerald-400 font-bold">
                Link copied!
              </p>
            )}
          </Label>
        </div>

        <div>
          <Button
            disabled={loading}
            onClick={regenerateLink}
            variant="ghost"
            size="sm"
            className="text-sm flex gap-2"
          >
            Regenerate link
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        {loading && (
          <p className="text-xs capitalize text-emerald-400 font-bold">
            Regenerating...
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
