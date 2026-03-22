
import { useState, useRef, useCallback } from "react";

const API = "http://localhost:4000";

// ── ICONS ────────────────────────────────────────────────────────────────────
const IconArrow   = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconDL      = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 3h14v2H5v-2z" fill="currentColor"/></svg>;
const IconVideo   = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/></svg>;
const IconAudio   = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 3v9.28A4 4 0 1 0 14 16V7h4V3h-6z" fill="currentColor"/></svg>;
const IconEye     = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"/></svg>;
const IconThumb   = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M2 20h2V10H2v10zm20-9c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L22 11z" fill="currentColor"/></svg>;
const IconUser    = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" fill="currentColor"/></svg>;
const IconLink    = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M13.5 6a7.5 7.5 0 1 0 0 15A7.5 7.5 0 0 0 13.5 6zm-9 7.5a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" fill="currentColor"/><path d="m20.03 20.03-3.5-3.5 1.06-1.06 3.5 3.5-1.06 1.06z" fill="currentColor"/></svg>;
const IconSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="28">
      <animate attributeName="stroke-dashoffset" dur=".9s" repeatCount="indefinite" from="28" to="-28"/>
    </circle>
  </svg>
);

// ── HELPERS ──────────────────────────────────────────────────────────────────
function formatNum(n) {
  if (!n) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}
function formatDuration(d) {
  if (!d) return "";
  if (typeof d === "string") return d;
  const h = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), s = d % 60;
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

// ── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%",
      transform: `translateX(-50%) translateY(${toast.visible ? 0 : 20}px)`,
      background: "var(--card)",
      border: `1px solid ${toast.type === "success" ? "rgba(34,211,165,.4)" : toast.type === "error" ? "rgba(255,68,68,.4)" : "var(--border)"}`,
      color: toast.type === "success" ? "var(--success)" : toast.type === "error" ? "#ff8888" : "var(--text)",
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

// ── FORMAT CARD ───────────────────────────────────────────────────────────────
function FormatCard({ format, type, onDownload }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onDownload(type, format.quality);
    setLoading(false);
  };

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 8,
      transition: "border-color .2s, transform .15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,68,68,.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800,
        background: "linear-gradient(90deg, var(--text), var(--muted))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{format.quality}</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{format.label}</div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "var(--accent2)",
        letterSpacing: ".5px", textTransform: "uppercase",
        background: "rgba(255,123,84,.1)", padding: "3px 8px",
        borderRadius: 5, width: "fit-content",
      }}>{format.type.toUpperCase()}</div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          marginTop: 4,
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          border: "none", outline: "none", color: "#fff",
          fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
          padding: "9px 0", borderRadius: 9, cursor: loading ? "not-allowed" : "pointer",
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
          opacity: loading ? .6 : 1,
          transition: "opacity .2s",
        }}
      >
        {loading ? <><IconSpinner /> Working…</> : <><IconDL /> Download</>}
      </button>
    </div>
  );
}

// ── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton() {
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

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function YTVault() {
  const [url, setUrl]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [info, setInfo]         = useState(null);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("video");
  const [descOpen, setDescOpen] = useState(false);
  const [toast, setToast]       = useState({ visible: false, message: "", type: "" });
  const toastTimer              = useRef(null);

  const showToast = (message, type = "") => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message, type });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  const fetchInfo = useCallback(async () => {
    if (!url.trim()) return showToast("Please paste a YouTube URL", "error");
    setError(""); setInfo(null); setLoading(true); setDescOpen(false);
    try {
      const res  = await fetch(`${API}/api/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleDownload = useCallback(async (type, quality) => {
    try {
      const endpoint = type === "video" ? "/api/download/video" : "/api/download/audio";
      const res  = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, quality }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Download failed");
      const a = document.createElement("a");
      a.href = `${API}${data.downloadUrl}`;
      a.download = data.fileName;
      a.click();
      showToast(`✅ Downloaded: ${data.fileName}`, "success");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    }
  }, [url]);

  return (
    <>
      {/* Global styles injected once */}
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
        @keyframes glow    { to { box-shadow: 0 0 50px rgba(255,68,68,.2); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "var(--bg)", position: "relative", overflowX: "hidden",
      }}>
        {/* BG glow */}
        <div style={{
          position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 600, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse, rgba(255,68,68,.12) 0%, transparent 70%)",
        }} />

        <div style={{
          position: "relative", zIndex: 1, maxWidth: 860,
          margin: "0 auto", padding: "60px 20px 100px",
        }}>

          {/* ── HEADER ── */}
          <header style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 0 30px rgba(255,68,68,.35)",
              }}>⬇</div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 28,
                fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)",
              }}>
                YT<span style={{ color: "var(--accent)" }}>Vault</span>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 15 }}>
              Paste any YouTube URL and grab video or audio in your preferred quality
            </p>
          </header>

          {/* ── SEARCH ── */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "6px 6px 6px 20px",
            display: "flex", gap: 10, alignItems: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,.4)", marginBottom: 32,
            transition: "border-color .2s",
          }}>
            <span style={{ opacity: .4, flexShrink: 0, color: "var(--text)" }}><IconLink /></span>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchInfo()}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "var(--text)", fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, padding: "12px 0",
              }}
            />
            <button
              onClick={fetchInfo}
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

          {/* ── ERROR ── */}
          {error && (
            <div style={{
              background: "rgba(255,68,68,.1)", border: "1px solid rgba(255,68,68,.3)",
              color: "#ff8888", padding: "14px 18px", borderRadius: 14,
              fontSize: 14, marginBottom: 28,
            }}>{error}</div>
          )}

          {/* ── SKELETON ── */}
          {loading && <Skeleton />}

          {/* ── RESULT ── */}
          {info && !loading && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 20, overflow: "hidden",
                boxShadow: "0 16px 60px rgba(0,0,0,.5)", marginBottom: 32,
              }}>
                {/* Video Hero */}
                <div style={{
                  display: "flex", gap: 22, padding: 24, alignItems: "flex-start",
                  flexWrap: "wrap",
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    flexShrink: 0, width: 220, borderRadius: 12,
                    overflow: "hidden", aspectRatio: "16/9",
                    background: "#000", position: "relative",
                  }}>
                    <img
                      src={info.thumbnail} alt="Thumbnail"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {info.duration && (
                      <div style={{
                        position: "absolute", bottom: 8, right: 8,
                        background: "rgba(0,0,0,.82)", color: "#fff",
                        fontSize: 11, fontWeight: 600, padding: "3px 8px",
                        borderRadius: 6, letterSpacing: ".3px",
                      }}>{formatDuration(info.duration)}</div>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700,
                      lineHeight: 1.4, marginBottom: 10, color: "var(--text)",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{info.title}</h2>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
                      {[
                        { icon: <IconUser />, val: info.uploader },
                        { icon: <IconEye />,  val: formatNum(info.viewCount) + " views" },
                        { icon: <IconThumb />, val: formatNum(info.likeCount) + " likes" },
                      ].map(({ icon, val }, i) => (
                        <span key={i} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          fontSize: 12, color: "var(--muted)",
                        }}>
                          <span style={{ opacity: .6 }}>{icon}</span>{val || "—"}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setDescOpen(o => !o)}
                      style={{
                        fontSize: 12, color: "var(--accent)", cursor: "pointer",
                        background: "none", border: "none", padding: 0,
                        fontFamily: "inherit", marginBottom: 6,
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {descOpen ? "▲ Hide" : "▼ Show"} description
                    </button>

                    {descOpen && (
                      <div style={{
                        fontSize: 13, lineHeight: 1.65, color: "var(--muted)",
                        background: "rgba(255,255,255,.03)", padding: "12px 14px",
                        borderRadius: 10, borderLeft: "2px solid var(--border)",
                        maxHeight: 140, overflowY: "auto",
                      }}>{info.description || "No description."}</div>
                    )}
                  </div>
                </div>

                {/* Formats */}
                <div style={{
                  padding: "24px", borderTop: "1px solid var(--border)",
                }}>
                  {/* Section title */}
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
                    letterSpacing: "1.2px", textTransform: "uppercase",
                    color: "var(--muted)", marginBottom: 16,
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    Download Formats
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>

                  {/* Tabs */}
                  <div style={{
                    display: "flex", background: "var(--card)",
                    border: "1px solid var(--border)", borderRadius: 12,
                    padding: 4, width: "fit-content", marginBottom: 22,
                  }}>
                    {[
                      { key: "video", icon: <IconVideo />, label: "Video" },
                      { key: "audio", icon: <IconAudio />, label: "Audio" },
                    ].map(({ key, icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setTab(key)}
                        style={{
                          background: tab === key ? "var(--accent)" : "none",
                          border: "none", color: tab === key ? "#fff" : "var(--muted)",
                          fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
                          padding: "9px 22px", borderRadius: 9, cursor: "pointer",
                          transition: "all .2s", display: "flex",
                          alignItems: "center", gap: 7, letterSpacing: ".3px",
                        }}
                      >{icon}{label}</button>
                    ))}
                  </div>

                  {/* Format Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}>
                    {(tab === "video" ? info.videoFormats : info.audioFormats).map(f => (
                      <FormatCard
                        key={f.quality}
                        format={f}
                        type={tab}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </>
  );
}
