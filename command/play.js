
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

require('../settings/config');
const { ytmp3 } = require('../start/lib/function/ytmp3')
const yts = require('yt-search');

let handler = async (m, { client, text, reply, quoted, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} impossible\n`)
    await reaction(m.chat, '⚡')
    let search = await yts(text)
    let telaso = search.all[0].url;
    let mbut = await ytmp3(telaso)
    let ahh = mbut.urlmp4
    
    client.sendMessage(m.chat, {
        audio: { url: ahh },
        mimetype: "audio/mpeg", 
        ptt: true
    }, { quoted: m })
}

handler.help = ['downloader music']
handler.tags = ['downloader']
handler.command = ["play"]

module.exports = handler
