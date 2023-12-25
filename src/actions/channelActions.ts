"use server"
import db from "@/config/db"
import type { Channel } from "../../prisma/output"
import { getCompleteServer } from "./serverActions"

type ChannelInput = Omit<Channel, "id" | "createdAt" | "updatedAt">

export async function createChannel({
  serverId,
  profileId,
  ...input
}: ChannelInput) {
  try {
    const server = await getCompleteServer(serverId)
    if (!server) throw new Error("Server not found")

    const foundProfile = server.members.find(
      (member) => (member.profileId = profileId)
    )
    if (!foundProfile) throw new Error("Profile not found")

    return await db.channel.create({
      data: {
        serverId,
        profileId,
        ...input,
      },
    })
  } catch (error) {
    return null
  }
}
