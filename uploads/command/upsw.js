
/*─────────────────────────────────────────
  GitHub   : https://github.com/kiuur    
  YouTube  : https://youtube.com/@kyuurzy
  Rest API : https://laurine.site        
  Telegram : https://kyuucode.t.me       
──────────────────────────────────────────*/

let handler = async (m, { client, text, reply }) => {
    const quoted = m.quoted ? m.quoted : null;

    if (!quoted && text) {
        client.sendStatusMention(
            { text: text },
            [m.chat]
        );
        return;
    }

    if (quoted && quoted.mtype === "conversation") {
        client.sendStatusMention(
            { text: quoted.text || '' },
            [m.chat]
        );
        return;
    }

    if (quoted.mtype === "audioMessage") {
        let audioData = await quoted.download();
        client.sendStatusMention(
            { audio: audioData, mimetype: 'audio/mp4', ptt: true },
            [m.chat]
        );
    }

    if (quoted.mtype === "imageMessage") {
        let imageData = await quoted.download();
        client.sendStatusMention(
            { image: imageData, caption: text || '' },
            [m.chat]
        );
    }

    if (quoted.mtype === "videoMessage") {
        let videoData = await quoted.download();
        client.sendStatusMention(
            { video: videoData, caption: text || '' },
            [m.chat]
        );
    }
};

handler.help = ['upsw'];
handler.tags = ['owner'];
handler.command = ['upsw'];
handler.owner = true;

module.exports = handler;
