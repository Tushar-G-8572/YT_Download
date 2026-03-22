// components/Skeleton.jsx
// ─────────────────────────────────────────────────────────────────────────────
// UI LAYER — shimmer loading placeholder shown while fetching video info.
// ─────────────────────────────────────────────────────────────────────────────

export default function Skeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, var(--surface) 25%, var(--border) 50%, var(--surface) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 20, padding: 24, display: "flex", gap: 24,
    }}>
      <div style={{ width: 200, height: 120, borderRadius: 12, flexShrink: 0, ...shimmer }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingTop: 6 }}>
        {[null, "60%", "40%"].map((w, i) => (
          <div key={i} style={{ height: 14, borderRadius: 6, width: w || "100%", ...shimmer }} />
        ))}
      </div>
    </div>
  );
}