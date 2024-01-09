import { useInfiniteQuery } from "@tanstack/react-query"
import { getChannelMessages } from "@/actions/messageActions"
import useSocket from "./useSocket/useSocket"

type UseChannelMsgQueryProps = {
  channelId: string
  batch: number
}

export default function useChannelMsgQuery({
  channelId,
  batch,
}: UseChannelMsgQueryProps) {
  const { connected } = useSocket()

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
    queryKey: ["getChannelMessages"],
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
