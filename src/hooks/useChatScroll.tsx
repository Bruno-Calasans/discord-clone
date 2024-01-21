/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect, useState } from "react";

type UseChatScrollProps = {
  chatTopRef: RefObject<HTMLDivElement>;
  chatBottomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  count: number;
  loadMore: () => void;
};

export default function useChatScroll({
  chatTopRef,
  chatBottomRef,
  shouldLoadMore,
  count,
  loadMore,
}: UseChatScrollProps) {
  const [initialized, setInitialized] = useState(false);

  // auto loading more messages on scroll to top
  useEffect(() => {
    const top = chatTopRef.current;

    const topScrollHandler = () => {
      if (top?.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    top?.addEventListener("scroll", topScrollHandler);

    return () => {
      top?.removeEventListener("scroll", topScrollHandler);
    };
  }, [chatTopRef, loadMore, shouldLoadMore]);

  // auto scroll to chat bottom after
  useEffect(() => {
    const top = chatTopRef.current;
    const bottom = chatBottomRef.current;

    const shouldAutoScroll = () => {
      if (!initialized && bottom) {
        setInitialized(true);
        return true;
      }

      if (!top) return false;

      const bottomDistance =
        top.scrollHeight - top.scrollTop - top.clientHeight;
      return bottomDistance <= 400;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottom?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [chatBottomRef, chatTopRef, loadMore, shouldLoadMore, count]);

  return <div>useChatScroll</div>;
}
