import path from "path";
import { YtDlp } from 'ytdlp-nodejs';
const ytdlp = new YtDlp();
const DOWNLOADS_DIR = './downloads';



export async function handleGetInfo(req,res) {
   const { url } = req.query;
   if (!url) return res.status(400).json({ error: 'URL is required' });
 
   try {
     const info = await ytdlp.getInfoAsync(url);
     const thumbnails = await ytdlp.getThumbnailsAsync(url);
 
     // Build available video formats
     const videoFormats = [];
     const audioFormats = [];
 
     const qualityMap = {
       '2160': '2160p (4K)',
       '1440': '1440p (2K)',
       '1080': '1080p (FHD)',
       '720':  '720p (HD)',
       '480':  '480p (SD)',
       '360':  '360p',
     };
 
     for (const [height, label] of Object.entries(qualityMap)) {
       videoFormats.push({
         quality: `${height}p`,
         label,
         type: 'mp4',
         available: true, // yt-dlp handles availability at download time
       });
     }
 
     audioFormats.push(
       { quality: '320kbps', label: '320 kbps (Best)', type: 'mp3' },
       { quality: '192kbps', label: '192 kbps (High)',  type: 'mp3' },
       { quality: '128kbps', label: '128 kbps (Medium)', type: 'mp3' },
     );
 
     res.json({
       title:       info.title,
       description: info.description,
       duration:    info.duration_string || info.duration,
       uploader:    info.uploader,
       viewCount:   info.view_count,
       likeCount:   info.like_count,
       uploadDate:  info.upload_date,
       thumbnail:   thumbnails?.[thumbnails.length - 1]?.url || info.thumbnail,
       videoFormats,
       audioFormats,
     });
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Failed to fetch video info. Check the URL.' });
   }
   
}

export async function handleDownloadVideo(req,res) {
  const { url, quality } = req.body;
  if (!url || !quality) return res.status(400).json({ error: 'URL and quality are required' });

  try {
    const response = await ytdlp
      .download(url)
      .format({ filter: 'mergevideo', quality, type: 'mp4' })
      .output(DOWNLOADS_DIR)
      .embedThumbnail()
      .run();

    const filePath = response.filePaths?.[0];
    if (!filePath) return res.status(500).json({ error: 'Download failed — no file found' });

    const fileName = path.basename(filePath);
    res.json({ success: true, fileName, downloadUrl: `/downloads/${fileName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Video download failed.' });
  }
}

export async function handleDownloadAudio(req,res) {
  const { url, quality } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Map "320kbps" -> "320"
  const bitrateNum = quality?.replace('kbps', '') || '192';

  try {
    const response = await ytdlp
      .download(url)
      .format({ filter: 'bestaudio', type: 'mp3' })
      .audioQuality(bitrateNum)
      .output(DOWNLOADS_DIR)
      .run();

    const filePath = response.filePaths?.[0];
    if (!filePath) return res.status(500).json({ error: 'Download failed — no file found' });

    const fileName = path.basename(filePath);
    res.json({ success: true, fileName, downloadUrl: `/downloads/${fileName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Audio download failed.' });
  }
}