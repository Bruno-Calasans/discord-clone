import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"
import NavigationSideBar from "@/components/NavigationSideBar/NavigationSideBar"
import { getCurrentProfile } from "@/actions/profileActions"
import { getServersByProfileId } from "@/actions/serverActions"
import Button from "../ui/Button"
import { getConversations } from "@/actions/conversationActions"
import ConversationsSideBar from "../ConversationsSideBar/ConversationsSideBar"
import { redirect } from "next/navigation"

export default async function DmMobileMenuToggle() {
  // cheking if user is logged in
  const profile = await getCurrentProfile()
  if (!profile) return redirect("/sign-in")

  // checking is server is found
  const conversations = await getConversations(profile.id)
  if (!conversations) return redirect("/")

  // getting all servers of the user
  const servers = await getServersByProfileId(profile.id)
  if (!servers) return redirect("/")

  return (
    <Sheet>
      <SheetTrigger asChild className="dark:bg-zinc-900 ">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="m-0 flex h-full w-[300px] gap-0 p-0 transition dark:bg-zinc-900"
      >
        <NavigationSideBar servers={servers} show />
        <ConversationsSideBar
          conversations={conversations}
          profile={profile}
          show
        />
      </SheetContent>
    </Sheet>
  )
}
