"use server"
import { AccessToken } from "livekit-server-sdk"
import { getCompleteServer } from "./serverActions"
import {
  getConversationById,
  getConversationByProfileId,
} from "./conversationActions"
import { getProfileById } from "./profileActions"

type GenerateChannelTokenInputs = {
  serverId: string
  memberId: string
  channelId: string
}

type GenerateCovnersationToken = {
  conversationId: string
  profileId: string
}

export async function generateChannelToken({
  serverId,
  channelId,
  memberId,
}: GenerateChannelTokenInputs) {
  try {
    const server = await getCompleteServer(serverId)
    if (!server) {
      throw new Error("Server not found")
    }

    const member = server.members.find((member) => member.id === memberId)
    if (!member) {
      throw new Error("Member not found")
    }

    const channel = server.channels.find((channel) => channel.id === channelId)
    if (!channel) {
      throw new Error("Channel not found")
    }

    const isAudioVideo = channel.type === "AUDIO" || channel.type === "VIDEO"

    if (!isAudioVideo) {
      throw new Error("Channel must be audio or video")
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const lkUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

    if (!apiKey || !apiSecret || !lkUrl) {
      throw new Error("Apikey or ApiSecret or Livekit url not found")
    }

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: member.name,
    })

    accessToken.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    })

    return accessToken.toJwt()
  } catch (error) {
    return null
  }
}

export async function generateConversationToken({
  conversationId,
  profileId,
}: GenerateCovnersationToken) {
  try {
    const conversation = await getConversationByProfileId({
      profileId,
      conversationId,
    })

    if (!conversation) {
      throw new Error("Conversation not found")
    }

    const { receiverProfileId, receiverProfile, senderProfile } = conversation
    const profile =
      receiverProfileId === profileId ? receiverProfile : senderProfile

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const lkUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

    if (!apiKey || !apiSecret || !lkUrl) {
      throw new Error("Apikey or ApiSecret or Livekit url not found")
    }

    const accessToken = new AccessToken(apiKey, apiSecret, {
      identity: profile.username,
    })

    accessToken.addGrant({
      room: conversationId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    })

    return accessToken.toJwt()
  } catch (error) {
    return null
  }
}
