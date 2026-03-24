import express from 'express';
import cors from 'cors';
import fs from 'fs';
import ytRouter from './routes/yt.route.js';
import path from 'path';

const app = express();

app.use(cors({
    origin:'http://localhost:5173'
}));
app.use(express.json());
const DOWNLOADS_DIR = './downloads';

app.use(express.static('./public'));

app.use('/api/yt/downloads', express.static(DOWNLOADS_DIR));

app.use('/api/yt',ytRouter);

app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"));
})

if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR);

export default app;