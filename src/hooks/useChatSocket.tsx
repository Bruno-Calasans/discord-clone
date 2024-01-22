"use client"
import { useEffect } from "react"
import useSocket from "./useSocket/useSocket"
import { useQueryClient } from "@tanstack/react-query"
import type { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile"
import { SocketEvents, SocketFn } from "@/types/Socket"

type UseChatSocketProps = {
  queryKey: string
  updateKey: SocketEvents
  createKey: SocketEvents
}

type SocketData = {
  message?: MessageWithMemberProfile
}

type QueryData = {
  pages?: {
    messages: MessageWithMemberProfile[]
    nextCursor: string | null
  }[]
  pageParams?: string[]
}

export default function useChatSocket({
  queryKey,
  createKey,
  updateKey,
}: UseChatSocketProps) {
  const queryClient = useQueryClient()
  const { connected, socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const createQueryDataHandler: SocketFn = ({ message }) => {
      if (!message) return

      queryClient.setQueryData([queryKey], (oldData?: QueryData) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                messages: [message],
                nextCursor: null,
              },
            ],
            pageParams: [""],
          } as QueryData
        }

        const newPages = [...oldData.pages]

        newPages[0] = {
          ...newPages[0],
          messages: [message, ...newPages[0].messages],
        }

        return {
          ...oldData,
          pages: newPages,
        }
      })
    }

    const updateQueryDataHandler: SocketFn = ({ message }) => {
      if (!message) return

      queryClient.setQueryData([queryKey], (oldData: QueryData) => {
        if (!oldData.pages || oldData.pages?.length === 0) return oldData

        // fiding and replacing the page's old messages
        const updatedPages = oldData.pages.map((page) => {
          // finding the page's old message and replacing it with the event's message
          const updatedMsgs = page.messages.map((msg) => {
            // found message
            if (message.id === msg.id) return message
            // old msg
            return msg
          })

          // updated date page
          return {
            ...page,
            messages: updatedMsgs,
          }
        })

        //updating the pages
        return {
          ...oldData,
          pages: updatedPages,
        }
      })
    }

    // create message
    socket.on(createKey, createQueryDataHandler)

    // update message
    socket.on(updateKey, updateQueryDataHandler)

    // removing socket events
    return () => {
      socket.removeListener(createKey, createQueryDataHandler)
      socket.removeListener(updateKey, updateQueryDataHandler)
    }
  }, [createKey, queryClient, queryKey, socket, updateKey])

  return { queryClient, socket, connected }
}
