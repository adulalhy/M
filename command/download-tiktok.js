
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

const axios = require('axios')

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} https://vt.tiktok.com/ZS6ThFced/\n`)

    let url = `https://www.laurine.site/api/downloader/tiktok?url=${encodeURIComponent(text)}`
    let res = await axios.get(url)

    await reaction(m.chat, "⚡")

    if (res.data && res.data.status && res.data.data) {
        let data = res.data.data
        let title = data.title || "Konten TikTok"
        let videoUrl = data.no_watermark
        let musicUrl = data.music
        let imageUrls = data.image || []
        let coverImage = data.cover || data.origin_cover

        if (videoUrl) {
            const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' })
            const contentType = videoRes.headers['content-type']

            if (contentType && contentType.includes('video')) {
                await client.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: `🎥 *Video TikTok*\n\n📌 *caption:* ${title}`
                }, { quoted: m })

                if (musicUrl) {
                    await client.sendMessage(m.chat, {
                        audio: { url: musicUrl },
                        mimetype: "audio/mpeg",
                        ptt: true
                    }, { quoted: m })
                }
                return
            }
        }

        if (imageUrls.length > 1) {
            let albumArray = imageUrls.map((url, index) => ({
                image: { url },
                caption: `🖼 Gambar ke-${index + 1}\n📌 *caption:* ${title}`
            }))
            await client.albumMessage(m.chat, albumArray, m)
        } else if (imageUrls.length === 1) {
            await client.sendMessage(m.chat, {
                image: { url: imageUrls[0] },
                caption: `🖼 *Foto TikTok*\n📌 *caption:* ${title}`
            }, { quoted: m })
        } else if (coverImage) {
            await client.sendMessage(m.chat, {
                image: { url: coverImage },
                caption: `🖼 *Foto TikTok*\n📌 *caption:* ${title}`
            }, { quoted: m })
        }

        if (musicUrl) {
            await client.sendMessage(m.chat, {
                audio: { url: musicUrl },
                mimetype: "audio/mpeg",
                ptt: true
            }, { quoted: m })
        }
    }
}

handler.help = ['downloader tiktok']
handler.tags = ['downloader']
handler.command = ["tiktok"]

module.exports = handler
