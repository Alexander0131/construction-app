import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiPageAddCount, getSinglePost } from "../../service/api";
import type {
  IModeType,
  IPostData,
  IPostImage,
  IPostMini,
  IEditableImage,
  IImagePlanItem,
} from "../../service/types";
import TextEditor from "./TextEditor";
import EditableImage from "./EditableImage";


export interface IPostDis {
  mode: IModeType;
  setAnyChanges: (value: boolean) => void;
  setFormData: (value: FormData | null) => void;
  resetKey: number;
}

// Small helpers

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function toEditable(img: IPostImage): IEditableImage {
  return { id: makeId(), url: img.url, public_id: img.public_id };
}

function revokeIfBlob(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function useChangedFields(
  defaultState: IPostMini | null,
  current: IPostMini
): Partial<IPostMini> {
  if (!defaultState) return {};

  const changed: Partial<IPostMini> = {};
  (Object.keys(current) as (keyof IPostMini)[]).forEach((key) => {
    if (current[key] !== defaultState[key]) {
      (changed as Record<string, string>)[key] = current[key];
    }
  });
  return changed;
}

// Component

export default function PostDisplay({
  mode,
  setAnyChanges,
  setFormData,
  resetKey,
}: IPostDis) {
  const location = useLocation();
  const called = useRef(false);
  const postId = location.pathname.split("/")[4];

  const [post, setPost] = useState<IPostData | null>(null);
  const [loading, setLoading] = useState(true);

  // Saved baseline — never mutated after initial fetch
  const [defaultState, setDefaultState] = useState<IPostMini | null>(null);

  // Live editable text fields
  const [postTitle, setPostTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentTitleTwo, setContentTitleTwo] = useState("");
  const [contentOne, setContentOne] = useState("");
  const [quote, setQuote] = useState("");
  const [contentTwo, setContentTwo] = useState("");

  // Live editable images — named slots + a free-form gallery
  const [heroImage, setHeroImage] = useState<IEditableImage | null>(null);
  const [featureImage, setFeatureImage] = useState<IEditableImage | null>(null);
  const [detailsImage, setDetailsImage] = useState<IEditableImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<IEditableImage[]>([]);
  const [deletedPublicIds, setDeletedPublicIds] = useState<string[]>([]);
  const [initialImageCount, setInitialImageCount] = useState(0);

  // Fetch

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await getSinglePost(postId);
        if (!res) return;

        // Page-view counter (fire once)
        if (!called.current) {
          called.current = true;
          apiPageAddCount(res.postId);
        }

        const initial: IPostMini = {
          postTitle: res.postTitle,
          description: res.description,
          contentTitle: res.contentTitle,
          contentTitleTwo: res.contentTitleTwo,
          content: res.content,
          quote: res.quote,
          contentTwo: res.contentTwo,
        };

        setPost(res);
        setDefaultState(initial);
        setPostTitle(initial.postTitle);
        setDescription(initial.description);
        setContentTitle(initial.contentTitle);
        setContentTitleTwo(initial.contentTitleTwo);
        setContentOne(initial.content);
        setQuote(initial.quote);
        setContentTwo(initial.contentTwo);

        const imgs = res.images ?? [];
        setHeroImage(imgs[0] ? toEditable(imgs[0]) : null);
        setFeatureImage(imgs[1] ? toEditable(imgs[1]) : null);
        setDetailsImage(imgs[2] ? toEditable(imgs[2]) : null);
        setGalleryImages(imgs.slice(3).map(toEditable));
        setInitialImageCount(imgs.length);
        setDeletedPublicIds([]);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  // Revoke any outstanding blob: previews when the component unmounts
  useEffect(() => {
    return () => {
      [heroImage, featureImage, detailsImage, ...galleryImages].forEach((img) => {
        if (img?.url) revokeIfBlob(img.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Discard unsaved edits on Cancel (resetKey bump from the parent)

  useEffect(() => {
    if (resetKey === 0) return; // skip on initial mount
    if (!defaultState || !post) return;

    setPostTitle(defaultState.postTitle);
    setDescription(defaultState.description);
    setContentTitle(defaultState.contentTitle);
    setContentTitleTwo(defaultState.contentTitleTwo);
    setContentOne(defaultState.content);
    setQuote(defaultState.quote);
    setContentTwo(defaultState.contentTwo);

    [heroImage, featureImage, detailsImage, ...galleryImages].forEach((img) => {
      if (img?.url) revokeIfBlob(img.url);
    });

    const imgs = post.images ?? [];
    setHeroImage(imgs[0] ? toEditable(imgs[0]) : null);
    setFeatureImage(imgs[1] ? toEditable(imgs[1]) : null);
    setDetailsImage(imgs[2] ? toEditable(imgs[2]) : null);
    setGalleryImages(imgs.slice(3).map(toEditable));
    setDeletedPublicIds([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Image slot handlers

  function replaceSlot(
    current: IEditableImage | null,
    setSlot: (v: IEditableImage) => void,
    file: File
  ) {
    if (current) revokeIfBlob(current.url);
    setSlot({
      id: current?.id ?? makeId(),
      url: URL.createObjectURL(file),
      public_id: current?.public_id,
      file,
    });
  }

  function deleteSlot(
    current: IEditableImage | null,
    setSlot: (v: null) => void
  ) {
    if (!current) return;
    revokeIfBlob(current.url);
    if (current.public_id) {
      setDeletedPublicIds((ids) => [...ids, current.public_id!]);
    }
    setSlot(null);
  }

  function replaceGalleryImage(id: string, file: File) {
    setGalleryImages((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        revokeIfBlob(img.url);
        return { ...img, file, url: URL.createObjectURL(file) };
      })
    );
  }

  function deleteGalleryImage(id: string) {
    setGalleryImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;
      revokeIfBlob(target.url);
      if (target.public_id) {
        setDeletedPublicIds((ids) => [...ids, target.public_id!]);
      }
      return prev.filter((img) => img.id !== id);
    });
  }

  function addGalleryImage(file: File) {
    setGalleryImages((prev) => [
      ...prev,
      { id: makeId(), url: URL.createObjectURL(file), file },
    ]);
  }

  // Detect changes + build FormData 

  const current: IPostMini = {
    postTitle,
    description,
    contentTitle,
    contentTitleTwo,
    content: contentOne,
    quote,
    contentTwo,
  };

  const changedFields = useChangedFields(defaultState, current);

  useEffect(() => {
    const hasTextChanges = Object.keys(changedFields).length > 0;

    const orderedImages = [heroImage, featureImage, detailsImage, ...galleryImages].filter(
      (img): img is IEditableImage => img !== null
    );

    const hasImageChanges =
      orderedImages.some((img) => img.file) ||
      orderedImages.length !== initialImageCount ||
      deletedPublicIds.length > 0;

    const anyChanges = hasTextChanges || hasImageChanges;
    setAnyChanges(anyChanges);

    if (!anyChanges) {
      setFormData(null);
      return;
    }

    const fd = new FormData();

    Object.entries(changedFields).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    if (hasImageChanges) {
      const plan: IImagePlanItem[] = [];
      orderedImages.forEach((img) => {
        if (img.file) {
          fd.append("newImages", img.file);
          plan.push({ type: "new", fileIndex: fd.getAll("newImages").length - 1 });
        } else if (img.public_id) {
          plan.push({ type: "existing", public_id: img.public_id });
        }
      });
      fd.append("imagePlan", JSON.stringify(plan));

      if (deletedPublicIds.length > 0) {
        fd.append("deleteImages", JSON.stringify(deletedPublicIds));
      }
    }

    setFormData(fd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    postTitle,
    description,
    contentTitle,
    contentTitleTwo,
    contentOne,
    quote,
    contentTwo,
    heroImage,
    featureImage,
    detailsImage,
    galleryImages,
    deletedPublicIds,
    initialImageCount,
  ]);

  // Helpers

  const editBorder = (extra = "") =>
    mode === "edit" ? `border rounded ${extra}` : extra;

  const inputProps = (value: string, onChange: (v: string) => void) => ({
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    disabled: mode === "display",
    readOnly: mode === "display",
    className: [
      "bg-transparent outline-none w-full",
      mode === "edit" ? "border-b border-white/40 focus:border-white" : "",
    ].join(" "),
  });

  // Loading 

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-screen bg-gray-200" />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="h-12 w-64 bg-gray-200 rounded mb-6" />
          <div className="h-5 w-full bg-gray-200 rounded mb-4" />
          <div className="h-5 w-11/12 bg-gray-200 rounded mb-4" />
          <div className="h-5 w-9/12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold">Post Not Found</h2>
      </div>
    );
  }

  // Render

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <EditableImage
          src={heroImage?.url}
          alt={postTitle}
          mode={mode}
          className="absolute inset-0 w-full h-full"
          dimOverlayClassName="bg-black/60"
          emptyLabel="Add hero image"
          onReplace={(file) => replaceSlot(heroImage, setHeroImage, file)}
          onDelete={() => deleteSlot(heroImage, setHeroImage)}
          onAdd={(file) => replaceSlot(null, setHeroImage, file)}
        />

        <div className="absolute bottom-0 z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-28 pointer-events-none">
          <div className="max-w-4xl text-white mr-2 w-full pointer-events-auto">
            <input
              {...inputProps(postTitle, setPostTitle)}
              autoFocus={mode === "edit"}
              className={`text-5xl md:text-7xl lg:text-8xl font-bold capitalize leading-tight bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-white/50 focus:border-white" : ""
              }`}
            />
            <input
              {...inputProps(description, setDescription)}
              className={`mt-8 text-xl text-gray-200 max-w-2xl leading-relaxed capitalize bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-white/40 focus:border-white" : ""
              }`}
            />
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-28 flex flex-wrap gap-5">
        <div className="flex flex-col gap-5">
          <div className="lg:col-span-4">
            <span className="uppercase text-yellow-600 tracking-[5px] text-sm">
              Project Overview
            </span>
            <input
              {...inputProps(contentTitle, setContentTitle)}
              className={`text-4xl lg:text-5xl font-bold capitalize leading-tight mt-6 bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-gray-300 focus:border-gray-700" : ""
              }`}
            />
            <div className="w-20 h-1 bg-yellow-600 mt-8" />
          </div>

          <div className={`lg:col-span-8 ${editBorder("p-1")}`}>
            <TextEditor
              postType="null"
              height="fit"
              value={contentOne}
              mode={mode}
              onChange={setContentOne}
            />
          </div>
        </div>

      {/* FEATURE IMAGE */}
        <EditableImage
          src={featureImage?.url ?? heroImage?.url}
          alt={postTitle}
          mode={mode}
          className="w-full h-[80vh]"
          emptyLabel="Add feature image"
          onReplace={(file) => replaceSlot(featureImage, setFeatureImage, file)}
          onDelete={() => deleteSlot(featureImage, setFeatureImage)}
          onAdd={(file) => replaceSlot(null, setFeatureImage, file)}
        />
      </section>

      {/* QUOTE */}
      {(post.quote || mode === "edit") && (
        <section className="bg-[#0f172a] py-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className={`flex justify-center items-center text-white gap-2 ${editBorder()}`}>
              <span className="text-4xl md:text-6xl font-light">"</span>
              <input
                {...inputProps(quote, setQuote)}
                placeholder={mode === "edit" ? "Enter a quote…" : ""}
                className={`text-4xl md:text-6xl font-light text-center text-white leading-relaxed bg-transparent outline-none flex-1 ${
                  mode === "edit" ? "border-b border-white/40 focus:border-white" : ""
                }`}
              />
              <span className="text-4xl md:text-6xl font-light">"</span>
            </div>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-12" />
          </div>
        </section>
      )}

      {/* DETAILS */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-3">
            <span className="uppercase text-yellow-600 tracking-[5px] text-sm">
              Quality Construction
            </span>
            <input
              {...inputProps(contentTitleTwo, setContentTitleTwo)}
              className={`text-5xl md:text-7xl lg:text-8xl font-bold capitalize leading-tight mt-4 bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-gray-300 focus:border-gray-700" : ""
              }`}
            />
            <div className={editBorder("p-1")}>
              <TextEditor
                postType="null"
                height="fit"
                value={contentTwo}
                mode={mode}
                onChange={setContentTwo}
              />detailsImage
            </div>
          </div>
          {featureImage?.url && 
            <EditableImage
                src={detailsImage?.url}
                alt={postTitle}
                mode={mode}
                className="rounded-xl shadow-2xl h-[500px] w-full"
                emptyLabel="Add details image"
                onReplace={(file) => replaceSlot(detailsImage, setDetailsImage, file)}
                onDelete={() => deleteSlot(detailsImage, setDetailsImage)}
                onAdd={(file) => replaceSlot(null, setDetailsImage, file)}
            />
           }
        </div>
      </section>

      {/* PROJECT INFO */}
      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { label: "Author", value: post.author },
              { label: "Appreciation", value: `${post.likes} Likes` },
              { label: "Feedback", value: `${post.comments} Comments` },
              {
                label: "Completion Date",
                value: new Date(post.createdAt).toLocaleDateString(),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="uppercase text-yellow-500 text-sm tracking-wider">{label}</p>
                <h3 className="mt-3 text-xl font-semibold">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
