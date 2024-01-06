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

export async function getConversation(
  senderProfileId: string,
  receiverProfileId: string
) {
  try {
    return await db.conversation.findFirst({
      where: {
        senderProfileId,
        receiverProfileId,
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

export async function getConversationById(id: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        id
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

export async function findOrCreateConversation(
  senderProfileId: string,
  receiverProfileId: string
) {
  try {
    if (senderProfileId === receiverProfileId) {
      throw new Error("You cannot start a conversation with yourself")
    }

    const senderProfile = await getProfileById(senderProfileId)
    const recieverProfile = await getProfileById(receiverProfileId)

    if (!senderProfile || !recieverProfile) {
      throw new Error("Sender profile or Reciever profile not found")
    }

    const conversation = await getConversation(
      senderProfileId,
      receiverProfileId
    )

    if (conversation) return conversation

    return await db.conversation.create({
      data: {
        senderProfileId,
        receiverProfileId,
      },
    })
  } catch (error) {
    return null
  }
}
