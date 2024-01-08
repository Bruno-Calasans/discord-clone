"use server"
import db from "@/config/db"
import { findChannelById } from "./channelActions"
import { findMemberById } from "./memberActions"
import { getServerMembers } from "./serverActions"

type ChannelMessageInputs = {
  content: string
  memberId: string
  channelId: string
  fileUrl?: string
}

export async function createChannelMessage({
  content,
  memberId,
  channelId,
  fileUrl,
}: ChannelMessageInputs) {
  try {
    const channel = await findChannelById(channelId)
    if (!channel) throw new Error("Channel not Found")

    const member = await findMemberById(memberId)
    if (!member) throw new Error("Member not Found")

    const members = await getServerMembers(channel.serverId)
    if (!members) throw new Error("Server has not members")

    const isServerMember = members.find(
      (serverMember) => serverMember.id === member.id
    )

    if (!isServerMember) {
      throw new Error("This member is not a member of the channel's server")
    }

    return await db.message.create({
      data: {
        content,
        memberId,
        channelId,
        fileUrl,
      },
    })
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getChannelMessages(channelId: string) {
  try {
    const channel = await findChannelById(channelId)
    if (!channel) throw new Error("Channel not Found")

    return await db.message.findMany({
      where: {
        channelId,
      },
    })
  } catch (error) {
    return null
  }
}
