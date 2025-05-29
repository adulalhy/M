
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

require('../settings/config');
const fs = require('fs');

let handler = async (m, { client, text, reply, quoted, mime, prefix, command }) => {
    if (!quoted) return reply(`\n*ex:* reply image/video ${prefix + command}\n`);
    try {
        if (/image/.test(mime)) {
            let media = await quoted.download();
            let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
                packname: packname,
                author: author,
            });
            await fs.unlinkSync(encmedia);
        } else if (/video/.test(mime)) {
            if ((quoted?.msg || quoted)?.seconds > 10) return reply('\ndurasi maksimal 10 detik\n')
                const media = await quoted.download();
                let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
                    packname: packname,
                    author: author,
                });
            await fs.unlinkSync(encmedia);
        } else {
                return reply(`\n*ex:* reply image/video ${prefix + command}\n`);
        }
    } catch (error) {
        console.error(error);
        return reply('error');
    }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['sticker', 's']

module.exports = handler
