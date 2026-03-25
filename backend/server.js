import app from "./src/app.js";
import path,{dirname} from "path";
import dotenv from 'dotenv';
dotenv.config()
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COOKIES_PATH = process.env.NODE_ENV === 'production'
  ? '/etc/secrets/cookies.txt'
  : path.join(__dirname, '..', '..', 'cookies.txt');

// Startup verification
if (process.env.NODE_ENV === 'production') {
  try {
    const cookieContent = fs.readFileSync(COOKIES_PATH, 'utf8');
    console.log('✅ Cookies file found, size:', cookieContent.length, 'bytes');
    console.log('First line:', cookieContent.split('\n')[0]);
  } catch (e) {
    console.error('❌ Cookies file missing or unreadable:', e.message);
  }
}

app.listen(4000,()=>{
    console.log(`Server is running on port 4000`);
})
