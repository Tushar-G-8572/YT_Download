import { Router } from "express";
import { handleDownloadAudio, handleDownloadVideo, handleGetInfo } from "../controller/yt.controller.js";
import { exec } from 'child_process';

const ytRouter = Router();

ytRouter.get('/info',handleGetInfo);

ytRouter.post('/download/audio',handleDownloadAudio)
ytRouter.post('/download/video',handleDownloadVideo);


ytRouter.get('/debug', (req, res) => {
  const url = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const cookiesPath = '/etc/secrets/cookies.txt';
  
  exec(`yt-dlp --cookies "${cookiesPath}" --dump-json "${url}" 2>&1`, 
    { timeout: 30000 },
    (error, stdout, stderr) => {
      res.json({
        exitCode: error?.code,
        stdout: stdout?.slice(0, 3000),
        stderr: stderr?.slice(0, 3000),
        cookiesExists: fs.existsSync(cookiesPath),
        cookiesSize: fs.existsSync(cookiesPath) ? fs.statSync(cookiesPath).size : 0
      });
    }
  );
});


export default ytRouter;