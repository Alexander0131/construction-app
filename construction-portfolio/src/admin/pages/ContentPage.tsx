import { useState } from "react";
import { useParams } from "react-router-dom";
import type { ContentType } from "../../service/api";
import { updateContent } from "../../lib/content";
import { type IModeType } from "../../service/types";
import ContentEditor from "../components/ContentEditor";

export default function ContentPage({ type }: { type: ContentType }) {
  const { id: contentId = "" } = useParams();

  const [mode, setMode] = useState<IModeType>("display");
  const [anyChanges, setAnyChanges] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);

  // Bumping this remounts ContentEditor, which refetches fresh data — used
  // both to discard unsaved edits (Cancel) and to reflect a successful save.
  const [remountKey, setRemountKey] = useState(0);

  async function handleSave() {
    if (!anyChanges || !formData) return;

    setSaving(true);
    try {
      await updateContent(type, contentId, formData);
      setMode("display");
      setAnyChanges(false);
      setFormData(null);
      setRemountKey((k) => k + 1);
    } catch (error) {
      console.error(`Failed to save ${type}:`, error);
      alert("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditToggle() {
    if (mode === "display") {
      setMode("edit");
      return;
    }
    await handleSave();
  }

  function handleCancel() {
    setMode("display");
    setAnyChanges(false);
    setFormData(null);
    setRemountKey((k) => k + 1);
  }

  return (
    <div>
      <div className="flex sticky justify-between items-center bg-amber-500 top-0 left-0 w-full px-3 py-2 text-sm z-50 shadow-md gap-2">
        <p className="font-medium capitalize truncate">
          {mode === "display" ? `Viewing ${type}` : `Editing ${type}${!anyChanges ? " — no changes yet" : ""}`}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {mode === "edit" && (
            <button
              className="bg-red-700 px-3 py-1 rounded text-white shadow disabled:opacity-50"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          )}

          <button
            disabled={(mode === "edit" && !anyChanges) || saving}
            className={`bg-slate-900 px-3 py-1 rounded text-white shadow transition-opacity ${
              (mode === "edit" && !anyChanges) || saving ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={handleEditToggle}
          >
            {saving ? "Saving…" : mode === "display" ? "Edit" : "Save"}
          </button>
        </div>
      </div>

      <ContentEditor
        key={remountKey}
        type={type}
        mode={mode}
        setAnyChanges={setAnyChanges}
        setFormData={setFormData}
      />
    </div>
  );
}
