const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chokidar = require('chokidar');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BASE_FOLDER = process.env.BASE_FOLDER;
const excludedFolders = ['node_modules', '.git', '.npm', 'session'];
const excludedFiles = ['package-lock.json'];

let uploadTimer = null;
const DELAY = 1 * 60 * 1000; // 1 menit

function resetUploadTimer() {
  if (uploadTimer) {
    clearTimeout(uploadTimer);
    console.log(`⏳ Perubahan terdeteksi, timer upload di-reset.`);
  }
  uploadTimer = setTimeout(() => {
    doUpload();
  }, DELAY);
}

function getAllFiles(dirPath, arrayOfFiles = [], base = dirPath) {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    console.error(`❌ Error membaca folder: ${dirPath}`, err);
    return arrayOfFiles;
  }

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const relative = path.relative(base, fullPath).replace(/\\/g, '/');

    try {
      if (fs.statSync(fullPath).isDirectory()) {
        if (!excludedFolders.includes(file)) getAllFiles(fullPath, arrayOfFiles, base);
      } else {
        if (!excludedFiles.includes(file)) arrayOfFiles.push({ full: fullPath, relative });
      }
    } catch (err) {
      console.error(`❌ Error membaca file: ${fullPath}`, err);
    }
  }
  
  return arrayOfFiles;
}

async function uploadFileToGitHub(localFilePath, githubPath) {
  const content = fs.readFileSync(localFilePath, { encoding: 'base64' });
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${githubPath}`;

  try {
    const res = await axios.put(apiUrl, {
      message: `Auto-upload ${githubPath}`,
      content,
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log(`✅ Uploaded: ${githubPath}`);
  } catch (error) {
    console.error(`❌ Error mengupload ${githubPath}:`, error.response?.data?.message || error.message);
  }
}

async function doUpload() {
  console.log(`🚀 Uploading files ke GitHub...`);
  const allFiles = getAllFiles(BASE_FOLDER);

  if (allFiles.length === 0) {
    console.log('📂 Folder kosong.');
    return;
  }

  await Promise.all(allFiles.map(file => uploadFileToGitHub(file.full, file.relative)));

  console.log(`✅ Upload selesai.`);
}

const watcher = chokidar.watch(BASE_FOLDER, {
  persistent: true,
  ignoreInitial: true,
  ignored: /(^|[\/\\])(\..|node_modules|package-lock\.json)/,
});

watcher
  .on('add', resetUploadTimer)
  .on('change', resetUploadTimer)
  .on('unlink', resetUploadTimer);

console.log(`👀 Monitoring ${BASE_FOLDER} untuk perubahan...`);

setInterval(() => {
  console.log(`⏳ Sedang menganalisa...`);
}, 10000); // menampilkan log setiap 10 detik