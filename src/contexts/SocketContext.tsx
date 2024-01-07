"use client"
import { createContext } from "react"
import { Socket } from "socket.io-client"

export type SocketContextData = {
  socket: Socket | null
  connected: boolean
}

export const socketContextDefaultData: SocketContextData = {
  socket: null,
  connected: false,
}

const SocketContext = createContext<SocketContextData>(socketContextDefaultData)
export default SocketContext
