const fs = require('fs');
const path = require('path');
const axios = require('axios');

let handler = async (m, { reply }) => {
  require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BASE_FOLDER = process.env.BASE_FOLDER;

  const excludedFolders = ['node_modules', '.npm', 'session'];
  const excludedFiles = ['package-lock.json'];

  async function uploadFileToGitHub(localFilePath, githubPath) {
    const content = fs.readFileSync(localFilePath, { encoding: 'base64' });
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${githubPath}`;

    try {
      const res = await axios.put(apiUrl, {
        message: `Upload ${githubPath}`,
        content
      }, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      return `✅ ${githubPath}`;
    } catch (error) {
      return `❌ ${githubPath} (error: ${error.response?.data?.message || error.message})`;
    }
  }

  function getAllFiles(dirPath, arrayOfFiles = [], base = dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relative = path.relative(base, fullPath).replace(/\\/g, '/');

      if (fs.statSync(fullPath).isDirectory()) {
        if (excludedFolders.includes(file)) continue; // skip folder
        getAllFiles(fullPath, arrayOfFiles, base);
      } else {
        if (excludedFiles.includes(file)) continue; // skip file
        arrayOfFiles.push({ full: fullPath, relative });
      }
    }
    return arrayOfFiles;
  }

  const allFiles = getAllFiles(BASE_FOLDER);
  if (allFiles.length === 0) return reply('📂 Folder kosong, tidak ada file untuk diupload.');

  reply(`🚀 Mengupload ${allFiles.length} file ke GitHub...`);

  const results = [];
  for (const file of allFiles) {
    const status = await uploadFileToGitHub(file.full, file.relative);
    results.push(status);
  }

  reply(results.join('\n'));
};

handler.help = ['gitpush']
handler.tags = ['tools']
handler.command = ['gitpush']

module.exports = handler;