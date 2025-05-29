let handler = async (m, { client, text, reply }) => {
    const quoted = m.quoted ? m.quoted : null;

    // 🔹 Jika hanya teks tanpa quoted, tetap kirim sebagai status
    if (!quoted && text) {
        client.sendStatusMention({ text: text }, [m.chat]);
        return;
    }

    // 🔹 Jika tidak ada quoted atau teks, beri peringatan
    if (!quoted && !text && !m.message.imageMessage) {
        return reply('❌ Tidak ada media atau teks yang dikirim!');
    }

    // 🔹 Menangani quoted message
    if (quoted?.mtype === "conversation") {
        client.sendStatusMention({ text: quoted.text || '' }, [m.chat]);
        return;
    }

    // 🔹 Menangani upload media tanpa quoted
    if (!quoted && m.message.imageMessage) {
        try {
            let imageData = await m.download();
            if (!imageData) return reply('❌ Gagal mengunduh gambar!');
            client.sendStatusMention({ image: imageData, caption: text || '' }, [m.chat]);
        } catch (error) {
            console.error("❌ Error saat mengunduh gambar:", error);
            reply(`❌ Terjadi kesalahan: ${error.message}`);
        }
    }

    // 🔹 Menangani quoted media
    if (quoted?.mtype === "audioMessage") {
        try {
            let audioData = await quoted.download();
            if (!audioData) return reply('❌ Gagal mengunduh audio!');
            client.sendStatusMention({ audio: audioData, mimetype: 'audio/mp4', ptt: true }, [m.chat]);
        } catch (error) {
            console.error("❌ Error saat mengunduh audio:", error);
            reply(`❌ Terjadi kesalahan: ${error.message}`);
        }
    }

    if (quoted?.mtype === "imageMessage") {
        try {
            let imageData = await quoted.download();
            if (!imageData) return reply('❌ Gagal mengunduh gambar!');
            client.sendStatusMention({ image: imageData, caption: text || '' }, [m.chat]);
        } catch (error) {
            console.error("❌ Error saat mengunduh gambar:", error);
            reply(`❌ Terjadi kesalahan: ${error.message}`);
        }
    }

    if (quoted?.mtype === "videoMessage") {
        try {
            let videoData = await quoted.download();
            if (!videoData) return reply('❌ Gagal mengunduh video!');
            client.sendStatusMention({ video: videoData, caption: text || '' }, [m.chat]);
        } catch (error) {
            console.error("❌ Error saat mengunduh video:", error);
            reply(`❌ Terjadi kesalahan: ${error.message}`);
        }
    }
};

handler.help = ['upsw'];
handler.tags = ['owner'];
handler.command = ['upsw'];
handler.owner = true;

module.exports = handler;