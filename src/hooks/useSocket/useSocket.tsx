"use client"
import { useContext } from "react"
import socketContext from "@/hooks/useSocket/SocketContext"

export default function useSocket() {
  return useContext(socketContext)
}
