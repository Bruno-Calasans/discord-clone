/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useModal from "@/hooks/useModal/useModal"
import MemberAvatar from "@/components/custom/MemberAvatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog"
import { ScrollArea } from "@/components/ui/ScrollArea"
import { getCompleteServer } from "@/actions/serverActions"
import { useRouter } from "next/navigation"

export default function ManageMembersModal() {
  const { isOpen, type, data, open, close } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "ManageMembers"
  const { server, profile } = data

  const updateServer = async () => {
    if (!server) return
    const updatedServer = await getCompleteServer(server.id)
    if (!updatedServer) return
    router.refresh()
    open("ManageMembers", { server: updatedServer, profile })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader className="center flex items-center">
          <DialogTitle className="text-center text-4xl font-bold text-indigo-600">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-md font-semibold">
            {server?.members.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <div className="flex flex-col gap-5">
            {server?.members.map((member) => (
              <MemberAvatar
                onChange={updateServer}
                key={member.id}
                member={member}
                profile={profile}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
