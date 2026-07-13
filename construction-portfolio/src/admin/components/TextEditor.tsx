import { useEffect, useRef, useState } from "react";
import type React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaBold, FaItalic, FaListUl, FaListOl, FaUndo, FaRedo } from "react-icons/fa";
import type { IModeType, TextEditorProps } from "../../service/types";

export default function TextEditor({ postType, height, value, mode, onChange }: TextEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<IModeType>(mode);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `outline-none prose max-w-none text-gray-700 min-h-${height}`,
      },
    },
  });

  // Sync content when value prop changes externally
  useEffect(() => {
    if (!editor || value === editor.getHTML()) return;
    editor.commands.setContent(value ?? "", { emitUpdate: false });
  }, [value, editor]);

  // Sync local editorMode when the parent mode prop changes
  useEffect(() => {
    setEditorMode(mode);
  }, [mode]);

  // Close editor on outside click — only for the generic (postType === null)
  // case. When postType is "post"/"project" the editor strictly follows the
  // parent's `mode` prop and is never auto-hidden.
  useEffect(() => {
    if (postType !== null) return;
    if (editorMode !== "edit") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setEditorMode("display");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [postType, editorMode]);

  const enterEditMode = () => {
    if (mode !== "edit") return; // respect parent's permission
    if (postType !== null && editorMode === "edit") return; // already locked open
    setEditorMode("edit");
    setTimeout(() => editor?.commands.focus(), 0);
  };

  // Prevent toolbar clicks from stealing focus away from editor
  const preventBlur = (e: React.MouseEvent) => e.preventDefault();

  const toolbarBtn = (isActive: boolean) =>
    `rounded-lg p-2 transition ${
      isActive ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-yellow-500 hover:text-white"
    }`;

  return (
    <div ref={wrapperRef} className="flex flex-col gap-2" onClick={enterEditMode}>
      {editorMode === "edit" && (
        <label className="text-lg font-semibold capitalize text-gray-700">
          {postType ?? "Editor"} Content
        </label>
      )}

      <div
        className={`overflow-hidden rounded transition-all ${
          editorMode === "edit" ? "border border-gray-300 bg-white shadow-sm" : ""
        }`}
      >
        {editorMode === "edit" && (
          <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 p-3">
            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={toolbarBtn(!!editor?.isActive("bold"))}
            >
              <FaBold />
            </button>

            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={toolbarBtn(!!editor?.isActive("italic"))}
            >
              <FaItalic />
            </button>

            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={toolbarBtn(!!editor?.isActive("bulletList"))}
            >
              <FaListUl />
            </button>

            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={toolbarBtn(!!editor?.isActive("orderedList"))}
            >
              <FaListOl />
            </button>

            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().undo().run()}
              className={toolbarBtn(false)}
            >
              <FaUndo />
            </button>

            <button
              type="button"
              onMouseDown={preventBlur}
              onClick={() => editor?.chain().focus().redo().run()}
              className={toolbarBtn(false)}
            >
              <FaRedo />
            </button>
          </div>
        )}

        <div className={editorMode === "edit" ? "p-5" : ""}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
