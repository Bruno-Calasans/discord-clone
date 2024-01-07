"use client"
import { useContext } from "react"
import socketContext from "@/contexts/SocketContext"

export default function useSocket() {
  return useContext(socketContext)
}
