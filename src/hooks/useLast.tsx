"use client"
type UseLastProps = {}

export default function useLast({}: UseLastProps) {
  const saveLastServer = (serverId: string) => {
    return localStorage.setItem("lastServer", serverId)
  }

  const saveLastChannel = (channelId: string) => {
    return localStorage.setItem("lastChannel", channelId)
  }

  const saveLastServerChannel = (serverId: string, channelId: string) => {
    return localStorage.setItem(
      "lastServerChannel",
      `servers/${serverId}/channels/${channelId}`,
    )
  }

  const getLastServer = () => {
    return localStorage.getItem("lastServer")
  }

  const getLastChannel = () => {
    return localStorage.getItem("lastChannel")
  }

  const getLastServerChannel = () => {
    return localStorage.getItem("lastServerChannel")
  }

  return {
    saveLastServer,
    saveLastChannel,
    saveLastServerChannel,
    getLastServer,
    getLastChannel,
    getLastServerChannel,
  }
}
