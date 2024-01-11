import { NextApiRequest } from "next"
import { Server as SocketServer } from "socket.io"
import type { NextApiResponseSocket } from "@/types/NextApiResponseSocket"
import type { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile"

type SocketData = {
  message?: MessageWithMemberProfile
}

// Checking if there's a socket connection already
export default function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseSocket
) {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any

    const io = new SocketServer(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)

      socket.on("message:create", ({ message }: SocketData) => {
        io.emit("message:create", { message })
      })

      socket.on("message:update", ({ message }: SocketData) => {
        io.emit("message:update", { message })
      })
    })

    res.socket.server.io = io
  }

  res.end()
}
