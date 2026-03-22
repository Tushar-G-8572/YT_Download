// pages/YTVaultPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// PAGE (UI LAYER entry point) — wires the hook to the UI components.
// This is the only place that calls useYTDownloader().
// It passes state + actions down as props. No logic lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { useYTDownloader } from "../hooks/useYtDownload";
import SearchBar from "../components/SearchBar";
import VideoInfo from "../components/VideoInfo";
import Skeleton  from "../components/Skeleton";
import Toast     from "../components/Toast";

export default function YTVaultPage() {
  // ── Get everything from the hook ──────────────────────────────────────────
  const {
    url, setUrl,
    info, loading, error, toast,
    handleFetch, handleDownload,
  } = useYTDownloader();

  return (
    <>
      {/* ── Global CSS variables + keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        :root {
          --bg: #0a0a0f; --surface: #111118; --card: #16161f;
          --border: #2a2a3a; --accent: #ff4444; --accent2: #ff7b54;
          --text: #f0f0f5; --muted: #6b6b80; --success: #22d3a5;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflowX: "hidden" }}>

        {/* Background glow */}
        <div style={{
          position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 600, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse, rgba(255,68,68,.12) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "60px 20px 100px" }}>

          {/* ── HEADER ── */}
          <header style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 0 30px rgba(255,68,68,.35)",
              }}>⬇</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)" }}>
                YT<span style={{ color: "var(--accent)" }}>Vault</span>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 15 }}>
              Paste any YouTube URL and grab video or audio in your preferred quality
            </p>
          </header>

          {/* ── SEARCH BAR — passes url state + actions to component ── */}
          <SearchBar
            url={url}
            setUrl={setUrl}
            onFetch={handleFetch}
            loading={loading}
          />

          {/* ── ERROR ── */}
          {error && (
            <div style={{
              background: "rgba(255,68,68,.1)", border: "1px solid rgba(255,68,68,.3)",
              color: "#ff8888", padding: "14px 18px", borderRadius: 14,
              fontSize: 14, marginBottom: 28,
            }}>
              {error}
            </div>
          )}

          {/* ── SKELETON — shown while fetching ── */}
          {loading && <Skeleton />}

          {/* ── VIDEO INFO — shown after successful fetch ── */}
          {info && !loading && (
            <VideoInfo
              info={info}
              onDownload={handleDownload}   // hook action passed down
            />
          )}

        </div>
      </div>

      {/* ── TOAST notification ── */}
      <Toast toast={toast} />
    </>
  );
}