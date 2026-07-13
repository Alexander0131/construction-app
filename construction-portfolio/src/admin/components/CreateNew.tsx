import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";
import Notification from "./Notification";
import { postNewPost, postNewProject } from "../../service/api";
import type { CreateNewProps } from "../../service/types";
import TextEditor from "./TextEditor";

interface ImageFile extends File {
  preview: string;
}

export default function CreateNew({ postType }: CreateNewProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentTitleTwo, setContentTitleTwo] = useState("");
  const [projectState, setProjectState] = useState<"new" | "ongoing" | "completed">("ongoing");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorOne, setEditorOne] = useState("");
  const [editorTwo, setEditorTwo] = useState("");
  const [quote, setQuote] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const filesWithPreview: ImageFile[] = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages((prev) => [...prev, ...filesWithPreview]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setContentTitle("");
    setContentTitleTwo("");
    setProjectState("ongoing");
    setImages([]);
    setEditorOne("");
    setEditorTwo("");
    setQuote("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(images.length)
    if (title.trim() === "") {
      setNotification({ message: "Please enter a title", type: "error" });
      return;
    }
    if (editorOne.length < 8) {
      setNotification({ message: "Please enter appropriate content", type: "error" });
      return;
    }
    if (!images.length){
      setNotification({message: "Please upload atleast one image", type: "error"})
      return;

    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("contentTitle", contentTitle);
      formData.append("contentTitleTwo", contentTitleTwo);
      formData.append("state", projectState);
      formData.append("quote", quote);
      formData.append("content", editorOne);
      formData.append("contentTwo", editorTwo);
      images.forEach((image) => formData.append("images", image));

      if (postType === "post") {
        await postNewPost(formData);
      } else {
        await postNewProject(formData);
      }

      setNotification({ message: `${postType === "post" ? "Post" : "Project"} published successfully`, type: "success" });
      resetForm();
    } catch (error) {
      console.error(error);
      setNotification({ message: "Failed to publish, please try again", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "rounded-2xl border border-gray-300 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg outline-none transition-all duration-300 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200";

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-2xl">
        <div className="bg-slate-900 px-4 sm:px-6 py-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500 capitalize">Create New {postType}</h1>
          <p className="mt-1 text-sm text-gray-300">Publish professional {postType}s and announcements.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 sm:p-5 md:p-8">
          <div className="flex flex-wrap gap-5 justify-around">
            <div className="w-full lg:max-w-100 flex flex-col gap-4 border-b-2 border-slate-200 lg:border-0 pb-7">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700 capitalize">{postType} Title</label>
                <input
                  type="text"
                  placeholder="Enter your title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700 capitalize">{postType} Description</label>
                <input
                  type="text"
                  placeholder="Enter a short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700 capitalize">Content title</label>
                <input
                  type="text"
                  placeholder="Enter your content title..."
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              <TextEditor postType={postType} height="[300px]" value="" mode="edit" onChange={setEditorOne} />
            </div>

            <div className="w-full lg:max-w-100 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700 capitalize">Quote</label>
                <input
                  type="text"
                  placeholder="Enter your quote..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700 capitalize">Content 2 title</label>
                <input
                  type="text"
                  placeholder="Enter your second content title..."
                  value={contentTitleTwo}
                  onChange={(e) => setContentTitleTwo(e.target.value)}
                  className={inputClass}
                />
              </div>

              <TextEditor postType={postType} height="[300px]" value="" mode="edit" onChange={setEditorTwo} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-lg font-semibold text-gray-700">Upload Images</label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-300 ${
                isDragActive ? "border-yellow-500 bg-yellow-50" : "border-gray-300 hover:border-yellow-500 hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-yellow-100 p-4 sm:p-5">
                  <FaCloudUploadAlt className="text-3xl sm:text-4xl text-yellow-600" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-semibold text-gray-700">Drag & Drop Images Here</p>
                  <p className="mt-1 text-sm text-gray-500">or click to browse from your device</p>
                </div>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div key={image.preview} className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-md">
                  <img src={image.preview} alt="preview" className="h-32 sm:h-40 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-amber-500 p-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
                  >
                    <FaTimes />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 truncate bg-black/60 p-2 text-xs text-white">
                    <FaImage />
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {postType === "project" && (
            <div className="flex flex-col gap-3">
              <label className="text-lg font-semibold text-gray-700 capitalize">{postType} State</label>
              <div className="flex flex-wrap gap-3">
                {(["new", "ongoing", "completed"] as const).map((option) => {
                  const activeColors: Record<typeof option, string> = {
                    new: "bg-yellow-500 border-yellow-500",
                    ongoing: "bg-blue-600 border-blue-600",
                    completed: "bg-green-600 border-green-600",
                  };
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setProjectState(option)}
                      className={`rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 font-medium capitalize transition-all duration-300 border ${
                        projectState === option
                          ? `text-white shadow-md ${activeColors[option]}`
                          : "bg-white text-gray-700 border-gray-300 hover:border-yellow-500"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-2xl bg-yellow-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-600 disabled:opacity-50"
            >
              {loading ? "Publishing..." : `Publish ${postType}`}
            </button>
          </div>
        </form>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={4000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
