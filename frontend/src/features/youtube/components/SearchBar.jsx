// components/SearchBar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// UI LAYER — URL input + Fetch button.
// Gets url/setUrl/handleFetch/loading from the hook via props.
// ─────────────────────────────────────────────────────────────────────────────

import { IconLink, IconArrow, IconSpinner } from "./ui/icons";

export default function SearchBar({ url, setUrl, onFetch, loading }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 20, padding: "6px 6px 6px 20px",
      display: "flex", gap: 10, alignItems: "center",
      boxShadow: "0 8px 40px rgba(0,0,0,.4)", marginBottom: 32,
    }}>
      <span style={{ opacity: .4, flexShrink: 0, color: "var(--text)" }}>
        <IconLink />
      </span>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onFetch()}
        placeholder="https://www.youtube.com/watch?v=..."
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, padding: "12px 0",
        }}
      />

      <button
        onClick={onFetch}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          border: "none", color: "#fff",
          fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
          letterSpacing: ".5px", padding: "12px 26px", borderRadius: 14,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 8,
          opacity: loading ? .7 : 1, transition: "opacity .2s",
          whiteSpace: "nowrap",
        }}
      >
        {loading ? <><IconSpinner /> Fetching…</> : <><IconArrow /> Fetch</>}
      </button>
    </div>
  );
}