"use server"
import db from "@/config/db"
import { getProfileById } from "./profileActions"

export async function getConversations(profileId: string) {
  try {
    const profile = await getProfileById(profileId)
    if (!profile) throw new Error("Profile not found")

    return await db.conversation.findMany({
      where: {
        OR: [
          {
            senderProfileId: profileId,
          },
          {
            receiverProfileId: profileId,
          },
        ],
      },
      include: {
        senderProfile: true,
        receiverProfile: true,
      },
    })
  } catch (error) {
    return null
  }
}
