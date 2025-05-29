require('../settings/config');
const fs = require('fs');
const ftp = require('ftp');

let handler = async (m, { client, text, reply, quoted, mime, prefix, command }) => {
  if (!quoted) return reply(`\n*ex:* reply file ${prefix + command} namafile\n`);

  try {
    let filename = text.split(' ')[0];
    const ext = mime.split('/')[1];
    if (!filename.includes('.')) filename += `.${ext}`;

    const media = await quoted.download();
    fs.writeFileSync(filename, media);

    const clientFtp = new ftp();
    clientFtp.on('ready', () => {
      clientFtp.put(filename, `/home/kamiberd/public_html/gambar/${filename}`, (err) => {
        if (err) {
          reply(`Error uploading file: ${err}`);
        } else {
          reply(`File uploaded successfully dengan nama ${filename}`);
        }
        clientFtp.end();
        fs.unlinkSync(filename);
      });
    });

    clientFtp.on('error', (err) => {
      reply(`FTP error: ${err}`);
    });

    clientFtp.connect({
      host: 'kamiberdua.my.id',
      user: 'kamiberd',
      password: '685sQ@t2GMcY.v'
    });
  } catch (error) {
    console.error(error);
    return reply('error');
  }
}

handler.help = ['ftpupload']
handler.tags = ['tools']
handler.command = ['ftpupload','ftp']

module.exports = handler