import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../service/api";

export const usePosts = () =>
  useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.currentPage + 1 : undefined),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
