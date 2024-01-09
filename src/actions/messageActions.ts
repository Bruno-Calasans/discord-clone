"use server"
import db from "@/config/db"
import { findChannelById } from "./channelActions"
import { findMemberById } from "./memberActions"
import { findServerById, getServerMembers } from "./serverActions"
import { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile"

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

type GetChannelMessagesParams = {
  channelId: string
  cursor: string
  batch: number
}

export async function getChannelMessages({
  channelId,
  batch,
  cursor,
}: GetChannelMessagesParams) {
  try {
    const channel = await findChannelById(channelId)
    if (!channel) throw new Error("Channel not Found")

    let messages: MessageWithMemberProfile[] = []

    if (cursor) {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        take: batch,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else {
      messages = await db.message.findMany({
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        take: batch,
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    let nextCursor = null
    if (messages && messages.length === batch) {
      nextCursor = messages[batch - 1].id
    }
    return { messages, nextCursor }
  } catch (error) {
    return null
  }
}

export async function findChannelMsgById(messageId: string) {
  try {
    return db.message.findUnique({
      where: {
        id: messageId,
      },
    })
  } catch (error) {
    return null
  }
}

type EditChannelMsgInput = {
  messageId: string
  content: string
  memberId: string
  serverId: string
}

export async function editChannelMsg({
  messageId,
  content,
  memberId,
  serverId,
}: EditChannelMsgInput) {
  try {
    const message = await findChannelMsgById(messageId)
    if (!message) {
      throw new Error("Channel message not found")
    }

    if (message.deleted) {
      throw new Error("Message is deleted")
    }

    const isMessageOwner = message.memberId === memberId
    if (!isMessageOwner) {
      throw new Error("You cannot edit other member's message")
    }

    const member = await findMemberById(memberId)
    if (!member) {
      throw new Error("Member not found")
    }

    const server = await findServerById(serverId)
    if (!server) {
      throw new Error("Server not found")
    }

    const isServerMember = member.serverId === serverId
    if (!isServerMember) {
      throw new Error("You are not a server member")
    }

    return await db.message.update({
      where: {
        id: messageId,
        memberId,
      },
      data: { content },
    })
  } catch (error) {
    return null
  }
}

type DeleteChannelMsgInput = {
  messageId: string
  memberId: string
  serverId: string
}

export async function deleteChannelMsg({
  messageId,
  memberId,
  serverId,
}: DeleteChannelMsgInput) {
  try {
    const message = await findChannelMsgById(messageId)
    if (!message) {
      throw new Error("Channel message not found")
    }

    if (message.deleted) {
      throw new Error("Message is already deleted")
    }

    const isMessageOwner = message.memberId === memberId
    if (!isMessageOwner) {
      throw new Error("You cannot edit other member's message")
    }

    const member = await findMemberById(memberId)
    if (!member) {
      throw new Error("Member not found")
    }

    const server = await findServerById(serverId)
    if (!server) {
      throw new Error("Server not found")
    }

    const isServerMember = member.serverId === serverId
    if (!isServerMember) {
      throw new Error("You are not a server member")
    }

    return await db.message.update({
      where: {
        id: messageId,
        memberId,
      },
      data: { deleted: true, content: "This message has been deleted." },
    })
  } catch (error) {
    return null
  }
}
