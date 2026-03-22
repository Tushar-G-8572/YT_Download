// hooks/useYTDownloader.js
// ─────────────────────────────────────────────────────────────────────────────
// HOOK LAYER — manages all state + business logic.
// Calls the API layer. Exposes clean values + actions to the UI layer.
// No JSX, no styles here.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from "react";
import { fetchVideoInfo, downloadVideo, downloadAudio } from "../services/youTubeApi";

export function useYTDownloader() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [url, setUrl]         = useState("");
  const [info, setInfo]       = useState(null);   // video metadata + formats
  const [loading, setLoading] = useState(false);  // fetching info
  const [error, setError]     = useState("");

  // ── Toast state ────────────────────────────────────────────────────────────
  const [toast, setToast]     = useState({ visible: false, message: "", type: "" });
  const toastTimer            = useRef(null);

  // ── Internal helpers ───────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "") => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message, type });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3500
    );
  }, []);

  // ── Actions exposed to UI ──────────────────────────────────────────────────

  /** Called when user hits Fetch. Calls API layer → stores result in state. */
  const handleFetch = useCallback(async () => {
    if (!url.trim()) {
      showToast("Please paste a YouTube URL", "error");
      return;
    }
    setError("");
    setInfo(null);
    setLoading(true);
    try {
      const data = await fetchVideoInfo(url);
      setInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, showToast]);

  /** Called when user taps a Download button on any format card. */
  const handleDownload = useCallback(
    async (type, quality) => {
      try {
        const result =
          type === "video"
            ? await downloadVideo(url, quality)
            : await downloadAudio(url, quality);

        // Trigger browser file download
        const a = document.createElement("a");
        a.href = result.downloadUrl;
        a.download = result.fileName;
        a.click();

        showToast(`✅ Downloaded: ${result.fileName}`, "success");
      } catch (err) {
        showToast(`❌ ${err.message}`, "error");
      }
    },
    [url, showToast]
  );

  // ── Return everything the UI needs ─────────────────────────────────────────
  return {
    // state
    url,
    info,
    loading,
    error,
    toast,
    // actions
    setUrl,         // bound to the input field
    handleFetch,    // bound to the Fetch button
    handleDownload, // passed down to FormatCard
  };
}