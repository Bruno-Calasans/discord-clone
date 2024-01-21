import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import ServerSideBar from "@/components/ServerSideBar/ServerSideBar";
import NavigationSideBar from "@/components/NavigationSideBar/NavigationSideBar";
import { getCurrentProfile } from "@/actions/profileActions";
import {
  getCompleteServer,
  getServersByProfileId,
} from "@/actions/serverActions";
import { redirect } from "next/navigation";
import Button from "../ui/Button";

type MobileMenuToggleProps = {
  serverId: string;
};

export default async function MobileMenuToggle({
  serverId,
}: MobileMenuToggleProps) {
  // cheking if user is logged in
  const profile = await getCurrentProfile();
  if (!profile) return redirect(`/`);

  // checking is server is found
  const server = await getCompleteServer(serverId);
  if (!server) return redirect(`/servers`);

  // Checking is user is member of this server
  const member = server.members.find(
    (member) => member.profileId === profile.id,
  );
  if (!member) return redirect(`/`);

  // getting all servers of the user
  const servers = await getServersByProfileId(profile.id);
  if (!servers) return redirect(`/`);

  // checking if user is currently on this server
  const isUserOnServer = servers.find(
    (userServer) => userServer.id === server.id,
  );
  if (!isUserOnServer) return redirect(`/`);

  return (
    <Sheet>
      <SheetTrigger className="dark:bg-zinc-900 " asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="m-0 flex h-full w-[300px] gap-0 p-0 transition dark:bg-zinc-900"
      >
        <NavigationSideBar servers={servers} classname="max-md:flex" />
        <ServerSideBar
          member={member}
          profile={profile}
          server={server}
          classname="max-md:flex"
        />
      </SheetContent>
    </Sheet>
  );
}
