import { Server as NetServer, Socket as NetSocket } from "net"
import { NextApiResponse } from "next"
import { Server as SocketIo } from "socket.io"

export type NextApiResponseSocket = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIo
    }
  }
}
