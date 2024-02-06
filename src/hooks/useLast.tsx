"use client"

export default function useLast() {
  const saveLastServer = (serverId: string) => {
    return localStorage.setItem("lastServer", serverId)
  }

  const getLastServer = () => {
    return localStorage.getItem("lastServer")
  }

  const saveLastChannel = (channelId: string) => {
    return localStorage.setItem("lastChannel", channelId)
  }

  const getLastChannel = () => {
    return localStorage.getItem("lastChannel")
  }

  const saveLastConversation = (conversationId: string) => {
    return localStorage.setItem("lastConversation", conversationId)
  }

  const getLastConversation = () => {
    return localStorage.getItem("lastConversation")
  }

  return {
    saveLastServer,
    saveLastChannel,
    getLastServer,
    getLastChannel,
    saveLastConversation,
    getLastConversation,
  }
}
