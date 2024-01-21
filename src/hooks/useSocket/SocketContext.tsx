"use client"
import { createContext } from "react"
import { ClientSocket } from "@/types/Socket"

export type SocketContextData = {
  socket: ClientSocket | null
  connected: boolean
}

export const socketContextDefaultData: SocketContextData = {
  socket: null,
  connected: false,
}

const SocketContext = createContext<SocketContextData>(socketContextDefaultData)
export default SocketContext
