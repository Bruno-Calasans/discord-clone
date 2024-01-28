/* eslint-disable react-hooks/exhaustive-deps */
import {
  generateChannelToken,
  generateConversationToken,
} from "@/actions/livekitActions"
import { useEffect, useState } from "react"

type TokenType = "channel" | "conversation"

type UseMidiaTokenProps = {
  type: TokenType
  serverId?: string
  memberId?: string
  channelId?: string
  conversationId?: string
  profileId?: string
}

export default function useMidiaToken({
  type,
  serverId,
  memberId,
  channelId,
  conversationId,
  profileId,
}: UseMidiaTokenProps) {
  const [token, setToken] = useState<string | null>(null)

  const loadChannelToken = async () => {
    if (!serverId || !memberId || !channelId) return
    const generatedToken = await generateChannelToken({
      serverId,
      memberId,
      channelId,
    })

    if (!generatedToken) return
    setToken(generatedToken)
  }

  const loadConversationToken = async () => {
    if (!conversationId || !profileId) return
    const generatedToken = await generateConversationToken({
      conversationId,
      profileId,
    })

    if (!generatedToken) return
    setToken(generatedToken)
  }

  const regenerateToken = (type: TokenType) => {
    if (type === "channel") {
      loadChannelToken()
    }

    if (type === "conversation") {
      loadConversationToken()
    }
  }

  useEffect(() => {
    if (type === "channel") {
      loadChannelToken()
    }

    if (type === "conversation") {
      loadConversationToken()
    }
  }, [type, serverId, memberId, channelId, conversationId, profileId])

  return { token, regenerateToken }
}
