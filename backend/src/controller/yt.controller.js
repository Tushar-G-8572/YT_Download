import dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url';
import path from "path";
import fs from 'fs';
import os from 'os';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { YtDlp } from 'ytdlp-nodejs';

const YTDLP_BINARY = process.env.NODE_ENV === 'production'
   ? path.join(__dirname, '..', '..', 'bin', 'yt-dlp')
   : 'yt-dlp';

const ytdlp = new YtDlp({ binaryPath: YTDLP_BINARY });

const DOWNLOADS_DIR = './downloads';

// ── Cookies setup ──────────────────────────────────────────────────────────
const SECRET_COOKIES = process.env.NODE_ENV === 'production'
   ? '/etc/secrets/cookies.txt'
   : path.join(__dirname, '..', '..', 'cookies.txt');

const COOKIES_PATH = path.join(os.tmpdir(), 'yt-cookies.txt');

if (fs.existsSync(SECRET_COOKIES)) {
   fs.copyFileSync(SECRET_COOKIES, COOKIES_PATH);
   console.log('✅ Cookies copied to:', COOKIES_PATH);
} else {
   console.error('❌ Source cookies not found:', SECRET_COOKIES);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function extractVideoId(url) {
   const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
   return match?.[1];
}

async function getInfoWithRetry(url, retries = 3) {
   for (let i = 0; i < retries; i++) {
      try {
         return await ytdlp.getInfoAsync(url, {
            cookies: COOKIES_PATH,
         });
      } catch (err) {
         console.warn(`⚠️ getInfo attempt ${i + 1} failed:`, err.message);
         if (i < retries - 1) {
            await new Promise(r => setTimeout(r, 2000 * (i + 1)));
         } else {
            throw err;
         }
      }
   }
}

// ── Controllers ────────────────────────────────────────────────────────────

export async function handleGetInfo(req, res) {
   const { url } = req.query;
   if (!url) return res.status(400).json({ error: 'URL is required' });

   // 1️⃣ Try YouTube Data API first (fast, no rate limit issues)
   const videoId = extractVideoId(url);
   if (videoId && process.env.YOUTUBE_API_KEY) {
      try {
         const apiRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${process.env.YOUTUBE_API_KEY}`
         );
         const data = await apiRes.json();
         const video = data.items?.[0];

         if (video) {
            const snippet = video.snippet;
            const stats = video.statistics;
            const duration = video.contentDetails?.duration;

            const videoFormats = [];
            const audioFormats = [];
            const qualityMap = {
               '2160': '2160p (4K)', '1440': '1440p (2K)',
               '1080': '1080p (FHD)', '720': '720p (HD)',
               '480': '480p (SD)', '360': '360p',
            };
            for (const [height, label] of Object.entries(qualityMap)) {
               videoFormats.push({ quality: `${height}p`, label, type: 'mp4', available: true });
            }
            audioFormats.push(
               { quality: '320kbps', label: '320 kbps (Best)', type: 'mp3' },
               { quality: '192kbps', label: '192 kbps (High)', type: 'mp3' },
               { quality: '128kbps', label: '128 kbps (Medium)', type: 'mp3' },
            );

            return res.json({
               title: snippet.title,
               description: snippet.description,
               duration: duration,
               uploader: snippet.channelTitle,
               viewCount: stats.viewCount,
               likeCount: stats.likeCount,
               uploadDate: snippet.publishedAt,
               thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url,
               videoFormats,
               audioFormats,
            });
         }
      } catch (apiErr) {
         console.warn('⚠️ YouTube API failed, falling back to yt-dlp:', apiErr.message);
      }
   }

   // 2️⃣ Fallback to yt-dlp with retry
   try {
      const info = await getInfoWithRetry(url);

      const videoFormats = [];
      const audioFormats = [];
      const qualityMap = {
         '2160': '2160p (4K)', '1440': '1440p (2K)',
         '1080': '1080p (FHD)', '720': '720p (HD)',
         '480': '480p (SD)', '360': '360p',
      };
      for (const [height, label] of Object.entries(qualityMap)) {
         videoFormats.push({ quality: `${height}p`, label, type: 'mp4', available: true });
      }
      audioFormats.push(
         { quality: '320kbps', label: '320 kbps (Best)', type: 'mp3' },
         { quality: '192kbps', label: '192 kbps (High)', type: 'mp3' },
         { quality: '128kbps', label: '128 kbps (Medium)', type: 'mp3' },
      );

      return res.json({
         title: info.title,
         description: info.description,
         duration: info.duration_string || info.duration,
         uploader: info.uploader,
         viewCount: info.view_count,
         likeCount: info.like_count,
         uploadDate: info.upload_date,
         thumbnail: info.thumbnail,
         videoFormats,
         audioFormats,
      });
   } catch (err) {
      console.error('=== YT-DLP ERROR ===');
      console.error('Message:', err.message);
      console.error('Cookies path:', COOKIES_PATH);
      console.error('Cookies exists:', fs.existsSync(COOKIES_PATH));
      return res.status(500).json({ error: 'Failed to fetch video info. Check the URL.' });
   }
}

export async function handleDownloadVideo(req, res) {
   const { url, quality } = req.body;
   if (!url || !quality) return res.status(400).json({ error: 'URL and quality are required' });

   try {
      const response = await ytdlp
         .download(url)
         .format({ filter: 'mergevideo', quality, type: 'mp4' })
         .output(DOWNLOADS_DIR)
         .embedThumbnail()
         .cookies(COOKIES_PATH)
         .run();

      const filePath = response.filePaths?.[0];
      if (!filePath) return res.status(500).json({ error: 'Download failed — no file found' });

      const fileName = path.basename(filePath);
      res.json({ success: true, fileName, downloadUrl: `/downloads/${fileName}` });
   } catch (err) {
      console.error('Video download error:', err.message);
      res.status(500).json({ error: 'Video download failed.' });
   }
}

export async function handleDownloadAudio(req, res) {
   const { url, quality } = req.body;
   if (!url) return res.status(400).json({ error: 'URL is required' });

   const bitrateNum = quality?.replace('kbps', '') || '192';

   try {
      const response = await ytdlp
         .download(url)
         .format({ filter: 'audioonly', type: 'mp3' })
         .audioQuality(bitrateNum)
         .output(DOWNLOADS_DIR)
         .cookies(COOKIES_PATH)
         .run();

      const filePath = response.filePaths?.[0];
      if (!filePath) return res.status(500).json({ error: 'Download failed — no file found' });

      const fileName = path.basename(filePath);
      res.json({ success: true, fileName, downloadUrl: `/downloads/${fileName}` });
   } catch (err) {
      console.error('Audio download error:', err.message);
      res.status(500).json({ error: 'Audio download failed.' });
   }
}