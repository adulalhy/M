
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

require('../settings/config');

let handler = async (m, { client, text, reaction, reply, prefix, command }) => {
  if (!text) return reply(`\n*ex:* ${prefix + command} apanih cok\n`)
  const media = `https://brat.caliphdev.com/api/brat?text=${text}`;
  await reaction(m.chat, "⚡")

  client.sendImageAsSticker(m.chat, media, m, {
    packname: packname,
    author: author
  });
}

handler.help = ['sticker brat'];
handler.tags = ['sticker'];
handler.command = ["sbrat", "brat"];

module.exports = handler;
