"use client";
import useModal from "@/hooks/useModal/useModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Copy, RefreshCcw, Check } from "lucide-react";
import { useState } from "react";
import { regenerateServerInviteCode } from "@/actions/serverActions";

export default function InviteModal() {
  const { isOpen, type, data, open, close } = useModal();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "Invite";
  const currentUrl = location.origin;
  const { server } = data;
  const inviteLink = `${currentUrl}/invite/${server?.inviteCode}`;

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const regenerateLinkHandler = async () => {
    if (!server) return;
    setLoading(true);
    const updatedServer = await regenerateServerInviteCode(server.id);
    if (updatedServer) open("Invite", { server: updatedServer });
    setLoading(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="bg-white text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-center text-4xl font-bold text-indigo-600">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-1">
          <Label className="text-bold flex w-full flex-col gap-2 font-semibold uppercase">
            Invite Link
            <div className="flex gap-1">
              <Input
                className="bg-zinc-200 p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={inviteLink}
                readOnly
              />
              <Button
                disabled={loading}
                variant="ghost"
                size="icon"
                onClick={copyLinkHandler}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs font-bold capitalize text-emerald-400">
                Link copied!
              </p>
            )}
          </Label>
        </div>

        <div>
          <Button
            disabled={loading}
            onClick={regenerateLinkHandler}
            variant="ghost"
            size="sm"
            className="flex gap-2 text-sm"
          >
            Regenerate link
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        {loading && (
          <p className="text-xs font-bold capitalize text-emerald-400">
            Regenerating...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
