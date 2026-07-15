import { useEffect, useState } from "react";

import type { PostType, IPostData } from "../../service/types";
import { getLimitedPosts } from "../../service/api";

export default function DashPosts() {
  const [postsData, setPostsData] = useState<IPostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        // Fetch latest 3 posts
        const postRes: IPostData[] = await getLimitedPosts(3);

        setPostsData(postRes);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-500">
        Loading posts...
      </div>
    );
  }

  return (
    <section className="w-full">
     
      {/* Posts */}
      {postsData.length > 0 ? (
        <div className="grid gap-2">
          {postsData.map((post) => (
            <article
              key={post._id}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              {post.images.length > 0 && (
                <img
                  src={post.images[0].url}
                  alt={post.title}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <h3 className="truncate text-lg font-semibold text-slate-800">
                  {post.title}
                </h3>

                {/* Post Content */}
                <div
                  className="mt-1 line-clamp-2 text-sm text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
          No posts available yet.
        </div>
      )}
    </section>
  );
}