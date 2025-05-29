let handler = async (m, { client, text, reply }) => {
    const quoted = m.quoted ? m.quoted : null;

    console.log("📢 Command 'upsw' diterima:", { quoted, text, media: m.message.imageMessage });

    // Jika hanya teks tanpa quoted atau media, tetap kirim sebagai status
    if (!quoted && text) {
        client.sendStatusMention({ text: text }, [m.chat]);
        console.log("✅ Status teks berhasil dikirim!");
        return;
    }

    // Jika tidak ada quoted atau teks, beri peringatan agar bot tetap merespon
    if (!quoted && !text && !m.message.imageMessage) {
        return reply('❌ Tidak ada media atau teks yang dikirim!');
    }

    // Menangani quoted message
    if (quoted?.mtype === "conversation") {
        client.sendStatusMention({ text: quoted.text || '' }, [m.chat]);
        console.log("✅ Status teks dari quoted berhasil dikirim!");
        return;
    }

    // Menangani upload media tanpa quoted
    if (!quoted && m.message.imageMessage) {
        try {
            let imageData = await m.download();
            if (!imageData) return reply('❌ Gagal mengunduh gambar!');
            client.sendStatusMention({ image: imageData, caption: text || '' }, [m.chat]);
            console.log("✅ Status gambar berhasil dikirim!");
        } catch (error) {
            console.error("❌ Error saat mengunduh gambar:", error);
            reply(`❌ Terjadi kesalahan: ${error.message}`);
        }
    }

    // Menangani quoted media
    if (quoted?.mtype === "audioMessage") {
        try {
            let audioData = await quoted.download();
            if (!audioData) return reply('❌ Gagal mengunduh audio!');
            client.sendStatusMention({ audio: audioData, mimetype: 'audio/mp4', ptt: true }, [m.chat]);
            console.log("✅ Status audio berhasil dikirim!");
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
            console.log("✅ Status gambar dari quoted berhasil dikirim!");
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
            console.log("✅ Status video berhasil dikirim!");
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