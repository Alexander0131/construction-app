import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjects } from "../service/api";

export const useProjects = () =>
  useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 1 }) => getProjects(pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.currentPage + 1 : undefined),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
