"use client"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getChannelMessages } from "@/actions/channelMessageActions"
import useSocket from "./useSocket/useSocket"
import useChatSocket from "./useChatSocket"

type UseChannelMsgQueryProps = {
  channelId: string
  batch: number
}

export default function useChannelMsgQuery({
  channelId,
  batch,
}: UseChannelMsgQueryProps) {
  const { connected } = useSocket()
  const queryKey = "getChannelMessages"
  const createKey = "message:create"
  const updateKey = "message:update"

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading,
    isError,
    fetchStatus,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    initialPageParam: "",
    queryFn: ({ pageParam }) =>
      getChannelMessages({
        channelId,
        batch,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: connected ? false : 1000,
  })

  useChatSocket({
    queryKey,
    createKey,
    updateKey,
  })

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchStatus,
    status,
    isLoading,
    isError,
  }
}
