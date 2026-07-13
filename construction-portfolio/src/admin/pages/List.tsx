import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";
import { FaPen, FaTrash } from "react-icons/fa";

import { deletePost, deleteProject } from "../../service/api";
import { usePosts } from "../../hooks/usePosts";
import { useProjects } from "../../hooks/useProjects";
import Popup from "../components/Popup";
import Loader from "../components/Loader";
import MiniLoader from "../components/MiniLoader";
import type { IBtn } from "../../service/types";

type ContentTab = "post" | "project";

interface ListItem {
  _id: string;
  contentId: string;
  title: string;
  image?: string;
}

export default function ListPage() {
  const [tab, setTab] = useState<ContentTab>("post");
  const [openPopup, setOpenPopup] = useState(false);
  const [popText, setPopText] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; type: ContentTab } | null>(null);

  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    data: postData,
    fetchNextPage: fetchNextPostPage,
    hasNextPage: hasNextPostPage,
    isFetchingNextPage: isFetchingNextPostPage,
    status: postStatus,
  } = usePosts();

  const {
    data: projectData,
    fetchNextPage: fetchNextProjectPage,
    hasNextPage: hasNextProjectPage,
    isFetchingNextPage: isFetchingNextProjectPage,
    status: projectStatus,
  } = useProjects();

  const posts: ListItem[] =
    postData?.pages.flatMap((page) =>
      page.posts.map((p) => ({ _id: p._id, contentId: p.postId, title: p.postTitle, image: p.images?.[0]?.url }))
    ) ?? [];

  const projects: ListItem[] =
    projectData?.pages.flatMap((page) =>
      page.projects.map((p) => ({
        _id: p._id,
        contentId: p.projectId,
        title: p.projectTitle,
        image: p.images?.[0]?.url,
      }))
    ) ?? [];

  const items = tab === "post" ? posts : projects;
  const status = tab === "post" ? postStatus : projectStatus;
  const isFetchingNext = tab === "post" ? isFetchingNextPostPage : isFetchingNextProjectPage;

  useEffect(() => {
    if (!inView) return;
    if (tab === "post" && hasNextPostPage) fetchNextPostPage();
    if (tab === "project" && hasNextProjectPage) fetchNextProjectPage();
  }, [inView, tab, hasNextPostPage, hasNextProjectPage, fetchNextPostPage, fetchNextProjectPage]);

  async function confirmDelete() {
    if (!pendingDelete) return;

    try {
      setLoadingState(true);
      if (pendingDelete.type === "post") {
        await deletePost(pendingDelete.id);
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
      } else {
        await deleteProject(pendingDelete.id);
        await queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
      setOpenPopup(false);
    } catch (error) {
      console.error(`Failed to delete ${pendingDelete.type}:`, error);
    } finally {
      setLoadingState(false);
    }
  }

  function askDelete(title: string, id: string) {
    setPendingDelete({ id, type: tab });
    setPopText(`Are you sure you want to delete "${title}"?`);
    setOpenPopup(true);
  }

  const cancelBtn: IBtn = { name: "Cancel", action: () => setOpenPopup(false) };
  const deleteBtn: IBtn = { name: "Delete", action: confirmDelete };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-around bg-slate-200 rounded p-0.5 max-w-md">
        {(["post", "project"] as const).map((option) => (
          <button
            key={option}
            className={`w-full rounded cursor-pointer capitalize py-1 transition-colors ${
              tab === option ? "bg-amber-500" : ""
            }`}
            onClick={() => setTab(option)}
          >
            {option}s
          </button>
        ))}
      </div>

      {status === "pending" ? (
        <MiniLoader />
      ) : items.length > 0 ? (
        <div>
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-1 bg-slate-200 m-3 rounded"
            >
              <Link to={`/admin/company/${tab}/${item.contentId}`} className="flex items-center min-w-0">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-14 object-cover rounded m-1 shrink-0"
                />
                <p className="text-sm capitalize truncate pr-2">{item.title}</p>
              </Link>

              <div className="px-2 flex gap-3 shrink-0">
                <Link to={`/admin/company/${tab}/${item.contentId}`}>
                  <FaPen className="text-sm cursor-pointer hover:text-amber-600" />
                </Link>
                <FaTrash
                  className="text-sm cursor-pointer hover:text-red-600"
                  onClick={() => askDelete(item.title, item._id)}
                />
              </div>
            </div>
          ))}
          <div ref={ref} />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No {tab}s created yet</div>
      )}

      {isFetchingNext && <div className="text-center py-4">Loading more…</div>}

      {openPopup && <Popup text={popText} btnA={cancelBtn} btnB={deleteBtn} />}
      {loadingState && <Loader />}
    </div>
  );
}
