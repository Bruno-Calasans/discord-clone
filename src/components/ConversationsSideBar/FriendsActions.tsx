"use client";
import ActionTooltip from "@/components/custom/ActionTooltip";
import { UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FriendsActions() {
  const router = useRouter();

  const clickHandler = () => {
    router.push("/conversations/friends");
  };

  return (
    <div
      onClick={clickHandler}
      className="group  rounded-sm transition hover:bg-emerald-500 hover:dark:bg-emerald-500"
    >
      <button className="flex h-full w-full items-center gap-2 p-2">
        <UsersRound
          size={25}
          className="text-emerald-500 transition group-hover:text-white"
        />
        <p>Friends</p>
      </button>
    </div>
  );
}
