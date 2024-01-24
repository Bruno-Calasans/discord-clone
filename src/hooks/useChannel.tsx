"use client"
import { useEffect, useState } from "react"
import useSocket from "./useSocket/useSocket"
import { Channel } from "../../prisma/output"
import { MemberWithProfile } from "@/types/MemberProfile"
import { SocketFn } from "@/types/Socket"

type MembersPerChannel = Record<string, MemberWithProfile[]>

type UseChannelData = {
  channels: Channel[]
  membersPerChannel: MembersPerChannel
}

export default function useChannel() {
  const { socket } = useSocket()
  const [data, setData] = useState<UseChannelData>({
    channels: [],
    membersPerChannel: {},
  })

  const getChannel = (channelId: string) => {
    const { channels, membersPerChannel } = data

    const foundChannel = channels.find((channel) => channel.id === channelId)
    if (!foundChannel || !(channelId in membersPerChannel)) return

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
    setData(({ channels, membersPerChannel }) => {

      const foundChannel = channels.find((c) => c.id === channel.id)
      const updatedChannels = foundChannel ? channels : [...channels, channel]

      const updatedMembers = membersPerChannel[channel.id]
        ? [...membersPerChannel[channel.id], member]
        : [member]

      return {
        channels: updatedChannels,
        membersPerChannel: {
          ...membersPerChannel,
          [channel.id]: updatedMembers,
        },
      }
    })
  }

  const leaveChannel = (member: MemberWithProfile, channel: Channel) => {
    setData((currData) => {
      const { channels, membersPerChannel } = currData

      const foundChannel = channels.find((c) => c.id === channel.id)
      if (!foundChannel) return currData

      const members = membersPerChannel[foundChannel.id]
      if (!members || members.length === 0) return currData

      // removing the leaving member
      const newMembers = members.filter((m) => m.id !== member.id)

      let updatedChannels = channels
      let updatedMembersPerChannel: MembersPerChannel = {}

      // removing empty channel and membersPerChannel
      if (newMembers.length === 0) {
        // removing the empty channel
        updatedChannels = channels.filter((c) => c.id !== channel.id)

        // removing the emtpy membersPerChannel obj
        for (let channelId in membersPerChannel) {
          const currentMembers = membersPerChannel[channelId]
          if (channelId !== channel.id) {
            updatedMembersPerChannel[channelId] = currentMembers
          }
        }
        //updating members
      } else {
        updatedMembersPerChannel = {
          ...membersPerChannel,
          [channel.id]: [...newMembers],
        }
      }

      return {
        channels: [...updatedChannels],
        membersPerChannel: {
          ...updatedMembersPerChannel,
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
  }, [socket])

  return {
    socket,
    data,
    joinChannel,
    leaveChannel,
    getMember,
    getMemberInChannel,
    getChannel,
    getChannelMembers,
  }
}
