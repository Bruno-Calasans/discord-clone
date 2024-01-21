import { AvatarImage, Avatar } from "@/components/ui/Avatar";
import type { MemberWithProfile } from "@/types/MemberProfile";
import {
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Check,
  Loader,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/DropdownMenu";
import { changeMemberRole, kickMember } from "@/actions/memberActions";
import { useState } from "react";
import type { Profile } from "../../../prisma/output";
import ICON_ROLE_MAP from "@/constants/iconRoleMap";

type MemberAvatarProps = {
  member: MemberWithProfile;
  profile?: Profile;
  onRoleChange?: (member: MemberWithProfile, role: string) => void;
  onKick?: (member: MemberWithProfile) => void;
  onBan?: (member: MemberWithProfile) => void;
  onChange: () => void;
};

export default function MemberAvatar({
  member,
  profile,
  onRoleChange,
  onKick,
  onChange,
}: MemberAvatarProps) {
  const [loading, setLoading] = useState(false);
  const roles = ["admin", "guest"];

  const roleChangeHandler = async (role: string) => {
    if (member.role === role) return;
    setLoading(true);
    await changeMemberRole(member.id, role);
    setLoading(false);
    if (onRoleChange) onRoleChange(member, role);
    onChange();
  };

  const kickMemberHandler = async () => {
    setLoading(true);
    await kickMember(member.id);
    setLoading(false);
    if (onKick) onKick(member);
    onChange();
  };

  const banMemberHandler = async () => {
    console.log(`Banning ${member.name}...`);
  };

  const isCurrentProfile = profile?.id == member.profileId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.profile.imgUrl} />
        </Avatar>

        <div>
          <div className="flex items-center gap-1">
            <p
              className={cn(
                "cursor-pointer text-sm font-bold text-zinc-700 transition-all hover:underline",
                isCurrentProfile && "text-indigo-500",
              )}
            >
              {member.name}
            </p>
            {ICON_ROLE_MAP[member.role]}
          </div>
          <p className="text-sm">{member.profile.email}</p>
        </div>
      </div>
      {loading && <Loader className="h-4 w-4 animate-spin text-zinc-500" />}
      {!loading && !isCurrentProfile && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuLabel>Member actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* role submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-center gap-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Role</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => roleChangeHandler(role)}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        {member.role === role ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <Shield
                            className={cn(
                              "h-4 w-4",
                              member.role === role &&
                                "fill-black dark:fill-white",
                            )}
                          />
                        )}
                        <span>{role}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Other actions */}
            <DropdownMenuItem onClick={kickMemberHandler}>
              Kick
            </DropdownMenuItem>
            <DropdownMenuItem onClick={banMemberHandler}>Ban</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
