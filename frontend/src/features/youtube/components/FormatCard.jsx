// components/FormatCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// UI LAYER — single quality format card with its own download loading state.
// Receives format data + onDownload callback from parent.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { IconDL, IconSpinner } from "./ui/icons";

export default function FormatCard({ format, type, onDownload }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onDownload(type, format.quality); // calls hook → calls api layer
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "16px 18px",
        display: "flex", flexDirection: "column", gap: 8,
        transition: "border-color .2s, transform .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,68,68,.4)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Quality label e.g. "1080p" */}
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800,
        background: "linear-gradient(90deg, var(--text), var(--muted))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {format.quality}
      </div>

      {/* Human label e.g. "1080p (FHD)" */}
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{format.label}</div>

      {/* File type badge e.g. "MP4" */}
      <div style={{
        fontSize: 11, fontWeight: 600, color: "var(--accent2)",
        letterSpacing: ".5px", textTransform: "uppercase",
        background: "rgba(255,123,84,.1)", padding: "3px 8px",
        borderRadius: 5, width: "fit-content",
      }}>
        {format.type.toUpperCase()}
      </div>

      {/* Download button */}
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          marginTop: 4,
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          border: "none", outline: "none", color: "#fff",
          fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
          padding: "9px 0", borderRadius: 9,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
          opacity: loading ? .6 : 1, transition: "opacity .2s",
        }}
      >
        {loading ? <><IconSpinner /> Working…</> : <><IconDL /> Download</>}
      </button>
    </div>
  );
}