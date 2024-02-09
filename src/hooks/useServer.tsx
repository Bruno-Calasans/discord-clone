import { useEffect } from "react"
import useSocket from "./useSocket/useSocket"
import { SocketFn } from "@/types/Socket"
import { MemberWithProfile } from "@/types/MemberProfile"
import { Server } from "../../prisma/output"

export default function useServer() {
  const { connected, socket } = useSocket()

  const joinServer = (member: MemberWithProfile, server: Server) => {
    if (!socket) return
    socket.emit("server:join", { member, server })
  }

  const leaveServer = (member: MemberWithProfile, server: Server) => {
    if (!socket) return
    socket.emit("server:leave", { member, server })
  }

  useEffect(() => {
    if (!socket) return

    const serverJoinHandler: SocketFn = ({ member, server }) => {
      if (!member || !server) return
    }

    socket.on("server:join", serverJoinHandler)

    return () => {
      socket.removeListener("server:join", serverJoinHandler)
    }
  }, [connected])

  return {
    joinServer,
    leaveServer,
  }
}
