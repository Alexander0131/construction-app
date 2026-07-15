import { useState } from "react";
import { useLocation } from "react-router-dom";
import PostDisplay from "../components/PostDisplay";
import { type IModeType } from "../../service/types";
import { updatePostApi } from "../../service/api";

export default function SingleAdminPost() {
  const location = useLocation();
  const postId = location.pathname.split("/")[4];

  const [mode, setMode] = useState<IModeType>("display");
  const [anyChanges, setAnyChanges] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);

  // Bumped on Cancel — tells PostDisplay to discard unsaved edits
  const [resetKey, setResetKey] = useState(0);
  // Bumped after a successful save — remounts PostDisplay so it refetches
  // the freshly-saved post (new image urls/public_ids, etc.)
  const [refreshToken, setRefreshToken] = useState(0);

  async function handleSave() {
    if (!anyChanges || !formData) return;

    setSaving(true);
    try {
      await updatePostApi(postId, formData);
      setMode("display");
      setAnyChanges(false);
      setFormData(null);
      setRefreshToken((t) => t + 1);
    } catch (error) {
      console.error("Failed to save post:", error);
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
    // mode === "edit" → save
    await handleSave();
  }

  function handleCancel() {
    setMode("display");
    setAnyChanges(false);
    setFormData(null);
    setResetKey((k) => k + 1);
  }

  return (
    <div>
      {/* Sticky toolbar */}
      <div className="flex sticky justify-between items-center bg-amber-500 top-0 left-0 w-full px-3 py-1 text-sm z-50 shadow-md">
        <p className="font-medium">
          {mode === "display"
            ? "Viewing post"
            : `Editing post${!anyChanges ? " — no changes yet" : ""}`}
        </p>

        <div className="flex items-center gap-1">
          {mode === "edit" && (
            <button
              className="bg-red-700 px-2 py-0.5 rounded text-white shadow disabled:opacity-50"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          )}

          <button
            disabled={(mode === "edit" && !anyChanges) || saving}
            className={`bg-slate-900 px-2 py-0.5 rounded text-white shadow transition-opacity ${
              (mode === "edit" && !anyChanges) || saving
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100"
            }`}
            onClick={handleEditToggle}
          >
            {saving ? "Saving…" : mode === "display" ? "Edit" : "Save"}
          </button>
        </div>
      </div>

      <PostDisplay
        key={refreshToken}
        mode={mode}
        setAnyChanges={setAnyChanges}
        setFormData={setFormData}
        resetKey={resetKey}
      />
    </div>
  );
}
