import express from 'express';
import cors from 'cors';
import fs from 'fs';
import ytRouter from './routes/yt.route.js';

const app = express();

app.use(cors());
app.use(express.json());
const DOWNLOADS_DIR = './downloads';

app.use('/api/yt/downloads', express.static(DOWNLOADS_DIR));

app.use('/api/yt',ytRouter);

if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR);

export default app;