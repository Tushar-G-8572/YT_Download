// components/Toast.jsx
// ─────────────────────────────────────────────────────────────────────────────
// UI LAYER — receives toast state from hook, renders notification.
// ─────────────────────────────────────────────────────────────────────────────

export default function Toast({ toast }) {
  const borderColor =
    toast.type === "success" ? "rgba(34,211,165,.4)"
    : toast.type === "error" ? "rgba(255,68,68,.4)"
    : "var(--border)";

  const color =
    toast.type === "success" ? "var(--success)"
    : toast.type === "error" ? "#ff8888"
    : "var(--text)";

  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%",
      transform: `translateX(-50%) translateY(${toast.visible ? 0 : 20}px)`,
      background: "var(--card)",
      border: `1px solid ${borderColor}`,
      color,
      padding: "14px 24px", borderRadius: 100, fontSize: 14,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 10px 40px rgba(0,0,0,.6)",
      opacity: toast.visible ? 1 : 0,
      transition: "all .3s", zIndex: 999,
      pointerEvents: "none", whiteSpace: "nowrap",
    }}>
      {toast.message}
    </div>
  );
}