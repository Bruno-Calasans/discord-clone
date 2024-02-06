import { getConversations } from "@/actions/conversationActions"
import { getCurrentProfile } from "@/actions/profileActions"
import ConversationRedirect from "@/components/RedirectPage/ConversationRedirect"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function ConversationsPage() {
  const profile = await getCurrentProfile()
  if (!profile) return redirectToSignIn()

  const conversations = await getConversations(profile.id)

  if (!conversations) return redirect("/servers")

  return <ConversationRedirect conversations={conversations} />
}
