// components/ui/icons.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All SVG icons in one place so any component can import them cleanly.
// ─────────────────────────────────────────────────────────────────────────────

export const IconArrow = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const IconDL = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 3h14v2H5v-2z" fill="currentColor"/>
  </svg>
);
export const IconVideo = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/>
  </svg>
);
export const IconAudio = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
    <path d="M12 3v9.28A4 4 0 1 0 14 16V7h4V3h-6z" fill="currentColor"/>
  </svg>
);
export const IconEye = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"/>
  </svg>
);
export const IconThumb = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M2 20h2V10H2v10zm20-9c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 2 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L22 11z" fill="currentColor"/>
  </svg>
);
export const IconUser = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" fill="currentColor"/>
  </svg>
);
export const IconLink = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
    <path d="M13.5 6a7.5 7.5 0 1 0 0 15A7.5 7.5 0 0 0 13.5 6zm-9 7.5a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" fill="currentColor"/>
    <path d="m20.03 20.03-3.5-3.5 1.06-1.06 3.5 3.5-1.06 1.06z" fill="currentColor"/>
  </svg>
);
export const IconSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="28">
      <animate attributeName="stroke-dashoffset" dur=".9s" repeatCount="indefinite" from="28" to="-28"/>
    </circle>
  </svg>
);