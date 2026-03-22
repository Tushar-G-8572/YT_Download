// components/VideoInfo.jsx
// ─────────────────────────────────────────────────────────────────────────────
// UI LAYER — shows thumbnail, title, meta stats, description toggle,
// format tabs (Video / Audio), and the grid of FormatCards.
// Receives `info` and `onDownload` from the page via props.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import FormatCard from "./FormatCard";
import { IconEye, IconThumb, IconUser, IconVideo, IconAudio } from "./ui/icons";
import { formatNum, formatDuration } from "../../utils/formatters";

export default function VideoInfo({ info, onDownload }) {
  const [tab, setTab]         = useState("video");
  const [descOpen, setDescOpen] = useState(false);

  const metaChips = [
    { icon: <IconUser />,  val: info.uploader },
    { icon: <IconEye />,   val: formatNum(info.viewCount) + " views" },
    { icon: <IconThumb />, val: formatNum(info.likeCount) + " likes" },
  ];

  const tabs = [
    { key: "video", icon: <IconVideo />, label: "Video" },
    { key: "audio", icon: <IconAudio />, label: "Audio" },
  ];

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 16px 60px rgba(0,0,0,.5)", marginBottom: 32,
      }}>

        {/* ── HERO: Thumbnail + Meta ── */}
        <div style={{ display: "flex", gap: 22, padding: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

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
              }}>
                {formatDuration(info.duration)}
              </div>
            )}
          </div>

          {/* Meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700,
              lineHeight: 1.4, marginBottom: 10, color: "var(--text)",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {info.title}
            </h2>

            {/* Stats row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
              {metaChips.map(({ icon, val }, i) => (
                <span key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, color: "var(--muted)",
                }}>
                  <span style={{ opacity: .6 }}>{icon}</span>
                  {val || "—"}
                </span>
              ))}
            </div>

            {/* Description toggle */}
            <button
              onClick={() => setDescOpen((o) => !o)}
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
              }}>
                {info.description || "No description."}
              </div>
            )}
          </div>
        </div>

        {/* ── FORMATS ── */}
        <div style={{ padding: 24, borderTop: "1px solid var(--border)" }}>

          {/* Section heading */}
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: "1.2px", textTransform: "uppercase",
            color: "var(--muted)", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            Download Formats
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Video / Audio tabs */}
          <div style={{
            display: "flex", background: "var(--card)",
            border: "1px solid var(--border)", borderRadius: 12,
            padding: 4, width: "fit-content", marginBottom: 22,
          }}>
            {tabs.map(({ key, icon, label }) => (
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
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Format cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}>
            {(tab === "video" ? info.videoFormats : info.audioFormats).map((f) => (
              <FormatCard
                key={f.quality}
                format={f}
                type={tab}
                onDownload={onDownload}   // ← comes from hook via page
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}