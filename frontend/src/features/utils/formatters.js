// utils/formatters.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions — no React, no state.
// Used by multiple UI components.
// ─────────────────────────────────────────────────────────────────────────────

export function formatNum(n) {
  if (!n) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}

export function formatDuration(d) {
  if (!d) return "";
  if (typeof d === "string") return d;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = d % 60;
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}