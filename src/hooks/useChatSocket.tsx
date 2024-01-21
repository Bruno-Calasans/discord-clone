"use client";
import { useEffect } from "react";
import useSocket from "./useSocket/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile";

type UseChatSocketProps = {
  queryKey: string;
  updateKey: string;
  createKey: string;
};

type SocketData = {
  message?: MessageWithMemberProfile;
};

type QueryData = {
  pages?: {
    messages: MessageWithMemberProfile[];
    nextCursor: string | null;
  }[];
  pageParams?: string[];
};

export default function useChatSocket({
  queryKey,
  createKey,
  updateKey,
}: UseChatSocketProps) {
  const queryClient = useQueryClient();
  const { connected, socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // create message
    socket.on(createKey, ({ message }: SocketData) => {
      if (!message) return;

      const data = queryClient.setQueryData(
        [queryKey],
        (oldData?: QueryData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  messages: [message],
                  nextCursor: null,
                },
              ],
              pageParams: [""],
            } as QueryData;
          }

          const newPages = [...oldData.pages];

          newPages[0] = {
            ...newPages[0],
            messages: [message, ...newPages[0].messages],
          };

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );

      console.log("Query client data", data);
    });

    // update message
    socket.on(updateKey, ({ message }: SocketData) => {
      if (!message) return;

      queryClient.setQueryData([queryKey], (oldData: QueryData) => {
        if (!oldData.pages || oldData.pages?.length === 0) return oldData;

        // fiding and replacing the page's old messages
        const updatedPages = oldData.pages.map((page) => {
          // finding the page's old message and replacing it with the event's message
          const updatedMsgs = page.messages.map((msg) => {
            // found message
            if (message.id === msg.id) return message;
            // old msg
            return msg;
          });

          // updated date page
          return {
            ...page,
            messages: updatedMsgs,
          };
        });

        //updating the pages
        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    });

    // removing socket events
    return () => {
      socket.off(createKey);
      socket.off(updateKey);
    };
  }, [createKey, queryClient, queryKey, socket, updateKey]);

  return { queryClient, socket, connected };
}
