import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLimitedPosts, getProjects } from "../service/api";

interface Row {
  id: string;
  title: string;
  content?: string;
  type: "post" | "project";
  image?: string;
}

export default function PostsProjects() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [posts, projectsRes] = await Promise.all([getLimitedPosts(3), getProjects(1)]);

        const postRows: Row[] = posts.slice(0, 3).map((p) => ({
          id: p.postId,
          title: p.postTitle,
          content: p.content,
          type: "post",
          image: p.images?.[0]?.url,
        }));

        const projectRows: Row[] = projectsRes.projects.slice(0, 2).map((p) => ({
          id: p.projectId,
          title: p.projectTitle,
          content: p.content,
          type: "project",
          image: p.images?.[0]?.url,
        }));

        setRows([...projectRows, ...postRows]);
      } catch (error) {
        console.error("Failed to load recent activity:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="text-sm text-gray-500 p-4">Loading…</p>;

  return (
    <div className="flex flex-col gap-2 p-2 sm:p-4">
      {rows.map((row) => (
        <Link
          key={`${row.type}-${row.id}`}
          to={`/${row.type}/${row.id}`}
          className="flex items-start gap-3 rounded-xl border border-gray-200 p-2 sm:p-3 hover:bg-gray-50 transition"
        >
          <img
            src={row.image}
            alt=""
            className="w-30 sm:w-20 sm:h-20 rounded-lg object-cover max-h-20"
          />

          <div className="flex-1 min-w-0 flex flex-col justify-center sm:h-20">
            <p className="capitalize text-sm sm:text-base font-medium truncate">
              {row.title}
            </p>
            {row.content && (
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 mt-0.5" dangerouslySetInnerHTML={{__html: row.content}}/>
          
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}