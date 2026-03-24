import express from 'express';
import cors from 'cors';
import fs from 'fs';
import ytRouter from './routes/yt.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:[
        'https://your-frontend-url.onrender.com',
        'http://localhost:5173'
    ]
}));

app.use(express.json());

const DOWNLOADS_DIR = path.join(__dirname,'..','downloads');

app.use(express.static(path.join(__dirname,'..','public')));

app.use('/api/yt/downloads', express.static(DOWNLOADS_DIR));

app.use('/api/yt',ytRouter);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
});

if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR);

export default app;