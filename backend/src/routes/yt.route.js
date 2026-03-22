import { Router } from "express";
import { handleDownloadAudio, handleDownloadVideo, handleGetInfo } from "../controller/yt.controller.js";

const ytRouter = Router();

ytRouter.get('/info',handleGetInfo);

ytRouter.post('/download/audio',handleDownloadAudio)
ytRouter.post('/download/video',handleDownloadVideo);


export default ytRouter;