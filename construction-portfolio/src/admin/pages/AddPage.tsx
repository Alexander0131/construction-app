import { useState } from "react";
import CreateNew from "../components/CreateNew";
import type { PostPageType } from "../../service/types";

export default function AddPage() {
  const [postPageState, setPostPageState] = useState<PostPageType>("main");

  if (postPageState === "main") {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-xl font-semibold mb-4">Add A New Post</h1>

        <div className="flex flex-col gap-3 max-w-xs">
          <div className="flex gap-2 border-gray-600 border rounded-2xl p-2 bg-slate-50 justify-between items-center">
            <span>Make a new Post</span>
            <button
              onClick={() => setPostPageState("post")}
              className="text-white bg-amber-500 hover:bg-amber-600 py-1.5 px-4 rounded-2xl transition"
            >
              Post
            </button>
          </div>

          <div className="flex gap-2 border-gray-600 border bg-slate-50 justify-between items-center rounded-2xl p-2">
            <span>Add a new Project</span>
            <button
              onClick={() => setPostPageState("project")}
              className="text-white bg-amber-500 hover:bg-amber-600 rounded-2xl px-4 py-1.5 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setPostPageState("main")}
        className="m-4 text-sm text-slate-600 hover:text-slate-900 underline"
      >
        ← Back
      </button>
      <CreateNew postType={postPageState} />
    </div>
  );
}
