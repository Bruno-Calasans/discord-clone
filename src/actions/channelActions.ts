"use server"
import db from "@/config/db"
import type { Channel } from "../../prisma/output"
import { getCompleteServer } from "./serverActions"
import { getCurrentProfile } from "./profileActions"

type ChannelInput = Omit<Channel, "id" | "createdAt" | "updatedAt">
type UpdateChannelInput = {
  channelId: string
  inputs: Omit<
    Channel,
    "id" | "createdAt" | "updatedAt" | "serverId" | "profileId"
  >
}

export async function findChannelById(id: string) {
  try {
    const channel = await db.channel.findUnique({
      where: {
        id,
      },
    })
    if (!channel) throw new Error("Channel not found")
    return channel
  } catch (error) {
    return null
  }
}

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

export async function updateChannel({ channelId, inputs }: UpdateChannelInput) {
  try {
    const channel = await findChannelById(channelId)
    if (!channel) throw new Error("Channel not found")

    return await db.channel.update({
      where: {
        id: channelId,
      },
      data: {
        ...inputs,
      },
    })
  } catch (error) {
    return null
  }
}

export async function deleteChannel(channelId: string) {
  try {
    const profile = await getCurrentProfile()
    if (!profile) throw new Error("Profile not found")

    const channel = await findChannelById(channelId)
    if (!channel) throw new Error("Channel not found")

    const isChannelOwner = channel.profileId === profile.id
    if (!isChannelOwner) throw new Error("You cannot delete this channel")

    return await db.channel.delete({
      where: {
        id: channelId,
      },
    })
  } catch (error) {
    return null
  }
}
