import { useRef } from "react";
import type React from "react";
import type { IModeType } from "../../service/types";

interface EditableImageProps {
  /** Current image url — a cloudinary url, a local blob: preview, or empty/undefined for an empty slot */
  src?: string;
  alt: string;
  mode: IModeType;
  className?: string;
  /** Always-on tint rendered under the hover buttons (e.g. "bg-black/60" for the hero) */
  dimOverlayClassName?: string;
  /** Label shown on the empty-slot placeholder tile */
  emptyLabel?: string;
  onReplace: (file: File) => void;
  onDelete: () => void;
  /** Called instead of onReplace when the slot is currently empty */
  onAdd?: (file: File) => void;
}

export default function EditableImage({
  src,
  alt,
  mode,
  className = "",
  dimOverlayClassName,
  emptyLabel = "Add image",
  onReplace,
  onDelete,
  onAdd,
}: EditableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (src) onReplace(file);
    else onAdd?.(file);
    e.target.value = ""; // allow re-selecting the same file next time
  }

  // ── Empty slot ─────────────────────────────────────────────────────────
  if (!src) {
    if (mode !== "edit") {
      return <div className={`bg-gray-100 ${className}`} />;
    }
    return (
      <button
        type="button"
        onClick={pickFile}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-gray-500 text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      >
        <span className="text-3xl leading-none">+</span>
        <span className="text-sm font-medium">{emptyLabel}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </button>
    );
  }

  // ── Filled slot ────────────────────────────────────────────────────────
  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />

      {dimOverlayClassName && (
        <div className={`absolute inset-0 pointer-events-none ${dimOverlayClassName}`} />
      )}

      {mode === "edit" && (
        <>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200" />
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={pickFile}
              className="bg-white/90 hover:bg-white text-slate-900 text-sm font-medium px-3 py-1.5 rounded shadow"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-600/90 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded shadow"
            >
              Delete
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
