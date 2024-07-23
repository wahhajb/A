let handler = async (m, { conn, usedPrefix, __dirname, text, isPrems }) => {

    const vn = './media/رياكشن_خدت_الصدمة_بقى_خدت__ان_انا_خدت_الصدمة(128.mp3';
  conn.sendPresenceUpdate('recording', m.chat);
  conn.sendMessage(m.chat, {audio: {url: vn}, ptt: true, mimetype: 'audio/mpeg', fileName: `deja de llorar.mp3`}, {quoted: m});
};

handler.help = ['notification']
handler.tags = ['notification']
handler.command = ['🙂🙂','🙂🙂🙂'] 
handler.customPrefix = /^(🙂🙂🙂|🙂|🙂🙂|🙂🙂🙂🙂🙂)$/i;
handler.command = new RegExp;
export default handler