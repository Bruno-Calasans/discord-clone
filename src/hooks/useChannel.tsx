import { useEffect, useState } from "react"
import useSocket from "./useSocket/useSocket"
import { Channel } from "../../prisma/output"
import { MemberWithProfile } from "@/types/MemberProfile"
import { SocketFn } from "@/types/Socket"

type UseChannelData = {
  channels: Channel[]
  membersPerChannel: Record<string, MemberWithProfile[]>
}

export default function useChannel() {
  const { socket } = useSocket()
  const [data, setData] = useState<UseChannelData>({
    channels: [],
    membersPerChannel: {},
  })

  const getChannel = (channelId: string) => {
    const foundChannel = data.channels.find(
      (channel) => channel.id === channelId,
    )
    if (!foundChannel || !(channelId in data.membersPerChannel)) return
    return foundChannel
  }

  const getChannelMembers = (channelId: string) => {
    const foundChannel = getChannel(channelId)
    if (!foundChannel) return
    return data.membersPerChannel[channelId]
  }

  const getMember = (memberId: string) => {
    for (const channelId in data.channels) {
      const members = data.membersPerChannel[channelId]
      const foundMember = members.find((m) => m.id === memberId)
      if (foundMember) return foundMember
    }
  }

  const getMemberInChannel = (memberId: string, channelId: string) => {
    const foundChannel = getChannel(channelId)
    if (!foundChannel) return

    const members = getChannelMembers(channelId)
    if (!members || members.length === 0) return

    return members.find((m) => m.id === memberId)
  }

  const joinChannel = (member: MemberWithProfile, channel: Channel) => {
    setData(({ channels, membersPerChannel }) => ({
      channels: [...channels, channel],
      membersPerChannel: {
        ...membersPerChannel,
        [channel.id]: [...membersPerChannel[channel.id], member],
      },
    }))
  }

  const leaveChannel = (member: MemberWithProfile, channel: Channel) => {
    setData((currData) => {
      const members = getChannelMembers(channel.id)

      if (!members || members.length === 0) return currData
      const newMembers = members.filter((m) => m.id !== member.id)

      return {
        ...currData,
        membersPerChannel: {
          ...currData.membersPerChannel,
          [channel.id]: [...newMembers],
        },
      }
    })
  }

  useEffect(() => {
    if (!socket) return

    const joinChannelHandler: SocketFn = ({ channel, member }) => {
      if (!member || !channel) return
      joinChannel(member, channel)
    }

    const leavelChannelHandler: SocketFn = ({ channel, member }) => {
      if (!member || !channel) return
      leaveChannel(member, channel)
    }

    socket.on("channel:join", joinChannelHandler)
    socket.on("channel:leave", leavelChannelHandler)

    return () => {
      socket.removeListener("channel:join", joinChannelHandler)
      socket.removeListener("channel:leave", leavelChannelHandler)
    }
  }, [])

  return {
    data,
    joinChannel,
    leaveChannel,
    getMember,
    getMemberInChannel,
    getChannel,
    getChannelMembers,
  }
}
