"use client";
import useModal from "@/hooks/useModal/useModal";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteChannelMsg } from "@/actions/channelMessageActions";
import MessagePreview from "../chat/MessagePreview";
import useSocket from "@/hooks/useSocket/useSocket";

export default function DeleteChannelMessageModal() {
  const { isOpen, type, data, close } = useModal();
  const router = useRouter();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(false);
  const isModalOpen = isOpen && type === "DeleteChannelMessage";
  const { message } = data;

  const deleteMessageHandler = async () => {
    if (!message) return;
    setLoading(true);
    const deletedMsg = await deleteChannelMsg({
      messageId: message.id,
      memberId: message.member.id,
      serverId: message.member.serverId,
    });

    if (deletedMsg) {
      router.refresh();
      socket?.emit("message:update", { message: deletedMsg });
    }
    setLoading(false);
    close();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold capitalize text-indigo-600">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-md flex flex-col gap-2 py-3 font-semibold text-zinc-900">
            <p>Are you sure you want to delete this message?</p>
            {message && <MessagePreview message={message} />}
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
  );
}
