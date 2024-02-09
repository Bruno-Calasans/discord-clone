/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import SocketContext from "@/hooks/useSocket/SocketContext"
import type { ClientSocket } from "@/types/Socket"

type SocketProviderProps = {
  children: React.ReactNode
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<ClientSocket | null>(null)
  const [connected, setConnected] = useState(false)

  const socketInitializer = async () => {
    if (socket) return

    const socketInstance = io(process.env.NEXT_PUBLIC_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    })

    socketInstance.on("connect", () => {
      setConnected(true)
    })

    socketInstance.on("disconnect", () => {
      setConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      setConnected(false)
      console.log(error, error.message)
    })

    setSocket(socketInstance as unknown as ClientSocket)
  }

  useEffect(() => {
    socketInitializer()
    return () => {
      socket?.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
