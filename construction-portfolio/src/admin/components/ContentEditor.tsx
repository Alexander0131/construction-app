import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiPageAddCount, type ContentType } from "../../service/api";
import { getSingleContent } from "../../lib/content";
import type {
  IModeType,
  INormalizedContent,
  IPostMini,
  ImageType,
  IEditableImage,
  IImagePlanItem,
} from "../../service/types";
import TextEditor from "./TextEditor";
import EditableImage from "./EditableImage";

export interface ContentEditorProps {
  type: ContentType;
  mode: IModeType;
  setAnyChanges: (value: boolean) => void;
  setFormData: (value: FormData | null) => void;
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function toEditable(img: ImageType): IEditableImage {
  return { id: makeId(), url: img.url, public_id: img.public_id };
}

function revokeIfBlob(url: string) {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function changedFieldsOf(defaultState: IPostMini | null, current: IPostMini): Partial<IPostMini> {
  if (!defaultState) return {};
  const changed: Partial<IPostMini> = {};
  (Object.keys(current) as (keyof IPostMini)[]).forEach((key) => {
    if (current[key] !== defaultState[key]) {
      (changed as Record<string, string>)[key] = current[key];
    }
  });
  return changed;
}

const TITLE_FIELD_NAME: Record<ContentType, keyof IPostMini | "postTitle" | "projectTitle"> = {
  post: "postTitle",
  project: "projectTitle",
};

export default function ContentEditor({ type, mode, setAnyChanges, setFormData }: ContentEditorProps) {
  const { id: contentId = "" } = useParams();
  const countedRef = useRef(false);

  const [item, setItem] = useState<INormalizedContent | null>(null);
  const [loading, setLoading] = useState(true);

  const [defaultState, setDefaultState] = useState<IPostMini | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentTitleTwo, setContentTitleTwo] = useState("");
  const [contentOne, setContentOne] = useState("");
  const [quote, setQuote] = useState("");
  const [contentTwo, setContentTwo] = useState("");
  const [state, setState] = useState<NonNullable<INormalizedContent["state"]>>("ongoing");

  const [heroImage, setHeroImage] = useState<IEditableImage | null>(null);
  const [featureImage, setFeatureImage] = useState<IEditableImage | null>(null);
  const [detailsImage, setDetailsImage] = useState<IEditableImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<IEditableImage[]>([]);
  const [deletedPublicIds, setDeletedPublicIds] = useState<string[]>([]);
  const [initialImageCount, setInitialImageCount] = useState(0);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await getSingleContent(type, contentId);
        if (!res) return;

        if (!countedRef.current) {
          countedRef.current = true;
          apiPageAddCount(res.contentId);
        }

        const initial: IPostMini = {
          postTitle: res.title,
          description: res.description,
          contentTitle: res.contentTitle,
          contentTitleTwo: res.contentTitleTwo,
          content: res.content,
          quote: res.quote,
          contentTwo: res.contentTwo,
        };

        setItem(res);
        setDefaultState(initial);
        setTitle(initial.postTitle);
        setDescription(initial.description);
        setContentTitle(initial.contentTitle);
        setContentTitleTwo(initial.contentTitleTwo);
        setContentOne(initial.content);
        setQuote(initial.quote);
        setContentTwo(initial.contentTwo);
        if (res.state) setState(res.state);

        const imgs = res.images ?? [];
        setHeroImage(imgs[0] ? toEditable(imgs[0]) : null);
        setFeatureImage(imgs[1] ? toEditable(imgs[1]) : null);
        setDetailsImage(imgs[2] ? toEditable(imgs[2]) : null);
        setGalleryImages(imgs.slice(3).map(toEditable));
        setInitialImageCount(imgs.length);
        setDeletedPublicIds([]);
      } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [type, contentId]);

  useEffect(() => {
    return () => {
      [heroImage, featureImage, detailsImage, ...galleryImages].forEach((img) => {
        if (img?.url) revokeIfBlob(img.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function replaceSlot(current: IEditableImage | null, setSlot: (v: IEditableImage) => void, file: File) {
    if (current) revokeIfBlob(current.url);
    setSlot({ id: current?.id ?? makeId(), url: URL.createObjectURL(file), public_id: current?.public_id, file });
  }

  function deleteSlot(current: IEditableImage | null, setSlot: (v: null) => void) {
    if (!current) return;
    revokeIfBlob(current.url);
    if (current.public_id) setDeletedPublicIds((ids) => [...ids, current.public_id!]);
    setSlot(null);
  }

  const current: IPostMini = {
    postTitle: title,
    description,
    contentTitle,
    contentTitleTwo,
    content: contentOne,
    quote,
    contentTwo,
  };

  const changedFields = changedFieldsOf(defaultState, current);

  useEffect(() => {
    const hasTextChanges = Object.keys(changedFields).length > 0;
    const hasStateChange = type === "project" && item?.state !== state;

    const orderedImages = [heroImage, featureImage, detailsImage, ...galleryImages].filter(
      (img): img is IEditableImage => img !== null
    );

    const hasImageChanges =
      orderedImages.some((img) => img.file) ||
      orderedImages.length !== initialImageCount ||
      deletedPublicIds.length > 0;

    const anyChanges = hasTextChanges || hasImageChanges || hasStateChange;
    setAnyChanges(anyChanges);

    if (!anyChanges) {
      setFormData(null);
      return;
    }

    const fd = new FormData();

    Object.entries(changedFields).forEach(([key, value]) => {
      const fieldName = key === "postTitle" ? TITLE_FIELD_NAME[type] : key;
      fd.append(fieldName, value as string);
    });

    if (hasStateChange) fd.append("state", state);

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
      if (deletedPublicIds.length > 0) fd.append("deleteImages", JSON.stringify(deletedPublicIds));
    }

    setFormData(fd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, contentTitle, contentTitleTwo, contentOne, quote, contentTwo, state, heroImage, featureImage, detailsImage, galleryImages, deletedPublicIds, initialImageCount]);

  const editBorder = (extra = "") => (mode === "edit" ? `border rounded ${extra}` : extra);

  const inputProps = (value: string, onChange: (v: string) => void) => ({
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    disabled: mode === "display",
    readOnly: mode === "display",
    className: `bg-transparent outline-none w-full ${mode === "edit" ? "border-b border-white/40 focus:border-white" : ""}`,
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-screen bg-gray-200" />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="h-12 w-64 bg-gray-200 rounded mb-6" />
          <div className="h-5 w-full bg-gray-200 rounded mb-4" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold capitalize">{type} Not Found</h2>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <section className="relative h-screen overflow-hidden">
        <EditableImage
          src={heroImage?.url}
          alt={title}
          mode={mode}
          className="absolute inset-0 w-full h-full"
          dimOverlayClassName="bg-black/60"
          emptyLabel="Add hero image"
          onReplace={(file) => replaceSlot(heroImage, setHeroImage, file)}
          onDelete={() => deleteSlot(heroImage, setHeroImage)}
          onAdd={(file) => replaceSlot(null, setHeroImage, file)}
        />

        <div className="absolute bottom-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-end pb-16 sm:pb-28 pointer-events-none">
          <div className="max-w-4xl text-white mr-2 w-full pointer-events-auto">
            {type === "project" && mode === "edit" && (
              <div className="flex gap-2 mb-4">
                {(["new", "ongoing", "completed"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setState(option)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                      state === option ? "bg-yellow-500 border-yellow-500 text-black" : "border-white/40 text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <input
              {...inputProps(title, setTitle)}
              autoFocus={mode === "edit"}
              className={`text-4xl sm:text-6xl lg:text-8xl font-bold capitalize leading-tight bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-white/50 focus:border-white" : ""
              }`}
            />
            <input
              {...inputProps(description, setDescription)}
              className={`mt-6 sm:mt-8 text-base sm:text-xl text-gray-200 max-w-2xl leading-relaxed capitalize bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-white/40 focus:border-white" : ""
              }`}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28 flex flex-wrap gap-5">
        <div className="flex flex-col gap-5 flex-1 min-w-[280px]">
          <div>
            <span className="uppercase text-yellow-600 tracking-[5px] text-xs sm:text-sm">Overview</span>
            <input
              {...inputProps(contentTitle, setContentTitle)}
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold capitalize leading-tight mt-6 bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-gray-300 focus:border-gray-700" : ""
              }`}
            />
            <div className="w-20 h-1 bg-yellow-600 mt-8" />
          </div>

          <div className={editBorder("p-1")}>
            <TextEditor postType={type} height="fit" value={contentOne} mode={mode} onChange={setContentOne} />
          </div>
        </div>

        <EditableImage
          src={featureImage?.url ?? heroImage?.url}
          alt={title}
          mode={mode}
          className="w-full flex-1 min-w-[280px] h-[50vh] sm:h-[80vh]"
          emptyLabel="Add feature image"
          onReplace={(file) => replaceSlot(featureImage, setFeatureImage, file)}
          onDelete={() => deleteSlot(featureImage, setFeatureImage)}
          onAdd={(file) => replaceSlot(null, setFeatureImage, file)}
        />
      </section>

      {(item.quote || mode === "edit") && (
        <section className="bg-[#0f172a] py-20 sm:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className={`flex justify-center items-center text-white gap-2 ${editBorder()}`}>
              <span className="text-3xl sm:text-6xl font-light">&ldquo;</span>
              <input
                {...inputProps(quote, setQuote)}
                placeholder={mode === "edit" ? "Enter a quote…" : ""}
                className={`text-2xl sm:text-4xl md:text-6xl font-light text-center text-white leading-relaxed bg-transparent outline-none flex-1 ${
                  mode === "edit" ? "border-b border-white/40 focus:border-white" : ""
                }`}
              />
              <span className="text-3xl sm:text-6xl font-light">&rdquo;</span>
            </div>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-12" />
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <div className="flex flex-col gap-3">
            <span className="uppercase text-yellow-600 tracking-[5px] text-xs sm:text-sm">Quality Construction</span>
            <input
              {...inputProps(contentTitleTwo, setContentTitleTwo)}
              className={`text-3xl sm:text-5xl font-bold capitalize leading-tight mt-4 bg-transparent outline-none w-full ${
                mode === "edit" ? "border-b border-gray-300 focus:border-gray-700" : ""
              }`}
            />
            <div className={editBorder("p-1")}>
              <TextEditor postType={type} height="fit" value={contentTwo} mode={mode} onChange={setContentTwo} />
            </div>
          </div>

          {(detailsImage?.url || mode === "edit") && (
            <EditableImage
              src={detailsImage?.url}
              alt={title}
              mode={mode}
              className="rounded-xl shadow-2xl h-[350px] sm:h-[500px] w-full"
              emptyLabel="Add details image"
              onReplace={(file) => replaceSlot(detailsImage, setDetailsImage, file)}
              onDelete={() => deleteSlot(detailsImage, setDetailsImage)}
              onAdd={(file) => replaceSlot(null, setDetailsImage, file)}
            />
          )}
        </div>
      </section>

      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {[
              { label: "Author", value: item.author },
              { label: "Appreciation", value: `${item.likes} Likes` },
              { label: "Feedback", value: `${item.comments} Comments` },
              { label: "Created", value: new Date(item.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="uppercase text-yellow-500 text-xs sm:text-sm tracking-wider">{label}</p>
                <h3 className="mt-3 text-lg sm:text-xl font-semibold">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
