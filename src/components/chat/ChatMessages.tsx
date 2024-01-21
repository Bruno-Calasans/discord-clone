"use client";
import type { MemberWithProfile } from "@/types/MemberProfile";
import type { Channel } from "../../../prisma/output";
import ChatWelcome from "./ChatWelcome";
import useChannelMsgQuery from "@/hooks/useChannelMsgQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChannelMessage from "./ChannelMessage";
import { useRef, ElementRef } from "react";
import Button from "../ui/Button";
import { MessageWithMemberProfile } from "@/types/MessageWithMemberProfile";
import useChatScroll from "@/hooks/useChatScroll";

type ChatMessagesProps = {
  channel: Channel;
  member: MemberWithProfile;
};

export default function ChatMessages({ channel, member }: ChatMessagesProps) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChannelMsgQuery({
    channelId: channel.id,
    batch: 10,
  });

  const messages: MessageWithMemberProfile[] = [];
  data?.pages.map((page) => {
    page?.messages.forEach((msg) => messages.push(msg));
  });

  const chatTopRef = useRef<ElementRef<"div">>(null);
  const chatBottomRef = useRef<ElementRef<"div">>(null);

  useChatScroll({
    chatBottomRef,
    chatTopRef,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    count: data?.pages[0]?.messages.length ?? 0,
    loadMore: fetchNextPage,
  });

  const loadMorePagesHandler = () => {
    fetchNextPage();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <p className="text-zinc-500">Loading Messages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        <ServerCrash className="h-6 w-6 text-zinc-500" />
        <p className="text-zinc-500">Something went wrong :(</p>
      </div>
    );
  }

  return (
    <div
      ref={chatTopRef}
      className="flex flex-col overflow-y-auto px-2 pb-6 scrollbar scrollbar-track-zinc-400 scrollbar-thumb-zinc-600 scrollbar-track-rounded-sm scrollbar-w-[4px] dark:scrollbar-track-zinc-700 dark:scrollbar-thumb-zinc-400"
    >
      {!hasNextPage && <ChatWelcome channel={channel} />}
      {hasNextPage && (
        <div className="flex w-full justify-center p-3 text-sm">
          {isFetchingNextPage ? (
            <div className="flex gap-1 text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Loading messages...</p>
            </div>
          ) : (
            <Button
              onClick={loadMorePagesHandler}
              size="sm"
              variant="ghost"
              className="hover:dark:bg-zinc-600"
            >
              Load Previous Messages
            </Button>
          )}
        </div>
      )}
      {/* Messages */}
      {messages && messages.length > 0 && (
        <div className="flex flex-col-reverse gap-2 border-none">
          {messages.map((message) => (
            <ChannelMessage
              key={message.id}
              member={member}
              message={message}
            />
          ))}
        </div>
      )}
      <div ref={chatBottomRef}></div>
    </div>
  );
}
