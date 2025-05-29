
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

const fs = require("fs")

let handler = async (m, { reply, command, prefix }) => {
    let all = await fs.readdirSync('./start/tmp')
    let teks = `jumlah sampah\n\n`
    teks += `total : ${all.filter(v => v.endsWith("gif") ||
                                  v.endsWith("png") ||
                                  v.endsWith("mp3") ||
                                  v.endsWith("mp4") ||
                                  v.endsWith("jpg") ||
                                  v.endsWith("jpeg") || 
                                  v.endsWith("webp") ||
                                  v.endsWith("webm") ).map(v=>v).length} listsampah\n\njika ingin membersihkan sampah silahkan ketik ${prefix}delsampah, untuk membersihkan isi tempat sampah tersebut\n`
     teks += all.filter(v => v.endsWith("gif") ||
                        v.endsWith("png") ||
                        v.endsWith("mp3") ||
                        v.endsWith("mp4") ||
                        v.endsWith("jpg") ||
                        v.endsWith("jpeg") ||
                        v.endsWith("webp") ||
                        v.endsWith("webm") ).map(o=>`${o}\n`).join("");
    reply(teks)
}

handler.help = ['sampah user'];
handler.tags = ['owner'];
handler.command = ["listsampah", "sampah"];
handler.owner = true;

module.exports = handler;
