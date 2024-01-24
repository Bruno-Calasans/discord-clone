import { NextApiRequest } from "next"
import { Server as SocketServer } from "socket.io"
import type { NextApiResponseSocket } from "@/types/NextApiResponseSocket"
import {
  SocketData,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from "@/types/Socket"

// Checking if there's a socket connection already
export default function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseSocket,
) {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any

    const io = new SocketServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)

      socket.on("message:create", (data) => {
        io.emit("message:create", data)
      })

      socket.on("message:update", (data) => {
        io.emit("message:update", data)
      })

      socket.on("screen-share:join", (data) => {
        io.emit("screen-share:join", data)
      })

      socket.on("screen-share:leave", (data) => {
        io.emit("screen-share:leave", data)
      })

      socket.on("channel:join", (data) => {
        io.emit("channel:join", data)
      })

      socket.on("channel:leave", (data) => {
        io.emit("channel:leave", data)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}
