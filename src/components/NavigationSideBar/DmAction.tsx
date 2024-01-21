import { useRouter } from "next/navigation";
import ActionTooltip from "../custom/ActionTooltip";
import { MessagesSquare } from "lucide-react";

export default function DmAction() {
  const router = useRouter();

  const clickHandler = () => {
    router.push("/conversations");
  };

  return (
    <div
      onClick={clickHandler}
      className="group  h-10 w-10 rounded-full bg-slate-200 transition hover:bg-emerald-500 dark:bg-slate-600 hover:dark:bg-emerald-500"
    >
      <ActionTooltip label="Direct messages" align="center" side="right">
        <button className="flex h-full w-full content-center items-center justify-center p-2">
          <MessagesSquare
            size={35}
            className="text-emerald-500 transition group-hover:text-white"
          />
        </button>
      </ActionTooltip>
    </div>
  );
}
