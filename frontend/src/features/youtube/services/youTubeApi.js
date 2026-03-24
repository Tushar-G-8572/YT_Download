
const BASE_URL = "https://yt-download-4ls5.onrender.com/api/yt"; 

/**
 * Fetch video info + available formats from the backend.
 * @param {string} url - YouTube URL
 * @returns {Promise<VideoInfo>}
 */
export async function fetchVideoInfo(url) {
  const res = await fetch(`${BASE_URL}/info?url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch video info");
  return data;
}

/**
 * Trigger a video download on the backend, returns download URL.
 * @param {string} url     - YouTube URL
 * @param {string} quality - e.g. "1080p", "720p"
 * @returns {Promise<{ fileName: string, downloadUrl: string }>}
 */
export async function downloadVideo(url, quality) {
  const res = await fetch(`${BASE_URL}/download/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, quality }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Video download failed");
  return { fileName: data.fileName, downloadUrl: `${BASE_URL}${data.downloadUrl}` };
}

/**
 * Trigger an audio download on the backend, returns download URL.
 * @param {string} url     - YouTube URL
 * @param {string} quality - e.g. "320kbps", "192kbps"
 * @returns {Promise<{ fileName: string, downloadUrl: string }>}
 */
export async function downloadAudio(url, quality) {
  const res = await fetch(`${BASE_URL}/download/audio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, quality }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Audio download failed");
  return { fileName: data.fileName, downloadUrl: `${BASE_URL}${data.downloadUrl}` };
}