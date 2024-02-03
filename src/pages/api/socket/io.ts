import { NextApiRequest } from "next"
import { Server as SocketServer } from "socket.io"
import type { NextApiResponseSocket } from "@/types/NextApiResponseSocket"
import {
  SocketData,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SOCKET_EVENTS,
  SOCKET_EVENTS_ARRAY,
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

      for (const EVENT of SOCKET_EVENTS_ARRAY) {
        socket.on(EVENT, (data) => {
          io.emit(EVENT, data)
        })
      }

      // socket.on("message:create", (data) => {
      //   io.emit("message:create", data)
      // })

      // socket.on("message:update", (data) => {
      //   io.emit("message:update", data)
      // })

      // socket.on("channel:join", (data) => {
      //   io.emit("channel:join", data)
      // })

      // socket.on("channel:leave", (data) => {
      //   io.emit("channel:leave", data)
      // })

      // socket.on("call:start", (data) => {
      //   io.emit("call:start", data)
      // })

      // socket.on("call:stop", (data) => {
      //   io.emit("call:stop", data)
      // })

      // socket.on("call:join", (data) => {
      //   io.emit("call:join", data)
      // })

      // socket.on("call:going", (data) => {
      //   io.emit("call:going", data)
      // })

      // socket.on("call:leave", (data) => {
      //   io.emit("call:leave", data)
      // })

      // socket.on("stream:join", (data) => {
      //   io.emit("stream:join", data)
      // })
    })

    res.socket.server.io = io
  }

  res.end()
}
