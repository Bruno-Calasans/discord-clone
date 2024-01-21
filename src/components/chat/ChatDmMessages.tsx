"use client";
import { Loader2, ServerCrash } from "lucide-react";
import { useRef, ElementRef } from "react";
import Button from "../ui/Button";
import useChatScroll from "@/hooks/useChatScroll";
import { ConversationWithProfiles } from "@/types/ConversationWithProfiles";
import { Profile } from "../../../prisma/output";
import DmChatWelcome from "./DmChatWelcome";
import DmMessage from "./ChatDmMessage";
import useDirectMsgQuery from "@/hooks/useDirectMsgQuery";
import { DmWithProfileConversation } from "@/types/DmWithProfileConversation";

type ChatDmMessagesProps = {
  conversation: ConversationWithProfiles;
  currentProfile: Profile;
  otherProfile: Profile;
};

export default function ChatDmMessages({
  conversation,
  currentProfile,
  otherProfile,
}: ChatDmMessagesProps) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDirectMsgQuery({
    conversationId: conversation.id,
    batch: 10,
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

  const messages: DmWithProfileConversation[] = [];
  data?.pages.map((page) => {
    page?.messages.forEach((msg) => messages.push(msg));
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
      {!hasNextPage && <DmChatWelcome profile={otherProfile} />}
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
      {messages && messages.length > 0 && (
        <div className="flex flex-col-reverse gap-2 border-none">
          {messages.map((message) => (
            <DmMessage
              key={message.id}
              message={message}
              currentProfile={currentProfile}
            />
          ))}
        </div>
      )}
      <div ref={chatBottomRef}></div>
    </div>
  );
}
