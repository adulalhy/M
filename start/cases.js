// start/cases.js
// Kumpulan handler lengkap untuk semua perintah (case command)

const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');
const util = require('util');

module.exports = {
  async get(client, m, { text, reply }) {
    if (!/^https?:\/\//.test(text)) return reply(`Contoh: get https://example.com/file.jpg`);
    const ajg = await fetch(text);
    const type = ajg.headers.get("content-type");
    if (type.startsWith("image/")) return client.sendMessage(m.chat, { image: { url: text } }, { quoted: m });
    if (type.startsWith("video/")) return client.sendMessage(m.chat, { video: { url: text } }, { quoted: m });
    if (type.startsWith("audio/")) return client.sendMessage(m.chat, { audio: { url: text }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
    let buffer = await ajg.buffer();
    let txt;
    try {
      txt = util.format(JSON.parse(buffer.toString()));
    } catch {
      txt = buffer.toString();
    }
    return reply(txt.slice(0, 65536));
  },

  public(client, m, { reply }) {
    client.public = true;
    return reply('✅ Mode public aktif');
  },

  self(client, m, { reply }) {
    client.public = false;
    return reply('✅ Mode self aktif');
  },

  ping(client, m, { reply }) {
    reply(' *PONG!!!* *MENYALA ABANGKU🔥🔥🔥*');
  },

  tagall: async (client, m, { args, reply }) => {
    if (!m.isGroup) return reply('❌ Hanya untuk grup');
    const textMessage = args.join(" ") || "TAG SEMUA!";
    const meta = await client.groupMetadata(m.chat);
    const teks = `${textMessage}\n\n` + meta.participants.map(p => `@${p.id.split('@')[0]}`).join('\n');
    return client.sendMessage(m.chat, {
      text: teks,
      mentions: meta.participants.map(p => p.id)
    }, { quoted: m });
  },

  hidetag: async (client, m, { text, reply }) => {
    if (!m.isGroup) return reply('❌ Hanya untuk grup');
    const meta = await client.groupMetadata(m.chat);
    return client.sendMessage(m.chat, {
      text: text || '',
      mentions: meta.participants.map(p => p.id)
    }, { quoted: m });
  },

  jeslyn: async (client, m, { text, reply }) => {
    if (!text) return reply(`Contoh: jeslyn haii, kamu siapa?`);
    const prompt = `Namamu adalah Jesslyn, perempuan 19 tahun. Kamu AI yang ramah, suka bilang 'yupp', 'emmm', dan langsung balas jika ada kata 'vn' tanpa menjelaskan.`;
    const res = await axios.get(`https://www.laurine.site/api/cai/prompt-ai?query=${encodeURIComponent(text)}&prompt=${encodeURIComponent(prompt)}`);
    let resultText = res.data?.data || 'Tidak bisa menjawab.';
    const regexSuara = /coba+\s*(kamu\s*)?(ngomong+|jawab+\s*ini+)|\bvn\b/i;
    const regexOwner = /\b(owner|pemilik|pencipta)\b/i;

    if (regexOwner.test(text)) {
      resultText = "Hehehe, dengan penuh semangat aku mau kasih tau! KyuuRzy adalah penciptaku, ownerku, dan pemilikku! Yupp, dia yang membuat aku bisa berbicara seperti ini~!";
    }

    if (resultText.length > 150 || regexSuara.test(text) || regexOwner.test(text)) {
      const ttsRes = await axios.get(`https://www.laurine.site/api/tts/elevenlabs?text=${encodeURIComponent(resultText)}&apiKey=${global.KEY}&voiceId=${global.IDVOICE}`);
      const buffer = Buffer.from(ttsRes.data.data.data);
      return client.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
    } else {
      return reply(resultText);
    }
  },

  remini: async (client, m, { reply }) => {
    client.enhancer = client.enhancer || {};
    if (m.sender in client.enhancer) return reply('❌ Masih ada proses sebelumnya. Tunggu.');
    let q = m.quoted || m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime || !/image\/(jpe?g|png)/.test(mime)) return reply('❌ Harap reply image yang valid.');
    client.enhancer[m.sender] = true;
    try {
      const img = await q.download?.();
      const { remini } = require('./function/remini');
      const result = await remini(img, "enhance");
      await client.sendFile(m.chat, result, '', '✅ Berhasil direstorasi', m);
    } catch (e) {
      reply('❌ Gagal memproses gambar.');
    } finally {
      delete client.enhancer[m.sender];
    }
  },

  setpp: async (client, m, { reply }) => {
    let mediaMsg = m.quoted?.message?.imageMessage || m.message?.imageMessage;
    if (!mediaMsg?.mediaKey) return reply('❌ Harap reply gambar yang valid!');
    let mediau = await client.downloadMediaMessage(mediaMsg);
    if (!mediau || mediau.length < 1) return reply('❌ Gagal mengunduh gambar!');
    await client.updateProfilePicture(m.sender, mediau);
    return reply('✅ Foto profil berhasil diperbarui');
  },

  session(client, m, { reply }) {
    const sesi = fs.readFileSync("./session/creds.json");
    client.sendMessage(m.chat, {
      document: sesi,
      fileName: 'session.json',
      mimetype: 'application/json'
    }, { quoted: m });
  },

  upsw2: async (client, m, { text, reply }) => {
    const statusJidList = Object.keys(m.chat || {});
    const backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    try {
      if (text) {
        await client.sendMessage('status@broadcast', {
          text,
        }, {
          textArgb: 0xffffffff,
          font: Math.floor(Math.random() * 9),
          backgroundColor,
          statusJidList,
          broadcast: true
        });
        return m.react('✅');
      }
      if (m.message.imageMessage || m.message.videoMessage) {
        const mediaData = await m.download();
        await client.sendMessage('status@broadcast', {
          [m.message.imageMessage ? 'image' : 'video']: mediaData,
          caption: text || ''
        }, { statusJidList, broadcast: true });
        return m.react('✅');
      }
    } catch (e) {
      console.error("❌ Error upsw2:", e);
      reply(`❌ Gagal mengupload status: ${e.message}`);
    }
  }

  // Tambahkan command lain jika diperlukan...
};