import { Hash } from "lucide-react";
import { Profile } from "../../../prisma/output";

type DmChatWelcomeProps = {
  profile: Profile;
};

export default function DmChatWelcome({ profile }: DmChatWelcomeProps) {
  return (
    <div className="mt-5 flex flex-col items-start justify-end gap-1 pb-5 font-bold text-zinc-600 dark:text-zinc-400">
      <div className="rounded-full bg-zinc-300 p-2 dark:bg-zinc-600 dark:text-white">
        <Hash size="50px" />
      </div>
      <div className="text-4xl">
        Start a conversation with{" "}
        <span className="text-zinc-900 dark:text-white">
          {profile.username}
        </span>
      </div>
      <div className="text-sm">
        This is the start of conversation with {profile.username}
      </div>
    </div>
  );
}
