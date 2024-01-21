"use client";
import { Plus } from "lucide-react";
import useModal from "@/hooks/useModal/useModal";
import ActionTooltip from "@/components/custom/ActionTooltip";

export default function CreateServerAction() {
  const { open } = useModal();

  const modalHandler = () => {
    open("CreateServer");
  };

  return (
    <div className="group  h-10 w-10 rounded-full bg-slate-200 transition hover:bg-emerald-500 dark:bg-slate-600 hover:dark:bg-emerald-500">
      <ActionTooltip label="Add new server" align="center" side="right">
        <button
          onClick={modalHandler}
          className="flex h-full w-full content-center items-center justify-center p-2"
        >
          <Plus
            size={35}
            className="text-emerald-500 transition group-hover:text-white"
          />
        </button>
      </ActionTooltip>
    </div>
  );
}
