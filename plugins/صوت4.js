let handler = async (m, { conn, usedPrefix, __dirname, text, isPrems }) => {

    const vn = './media/صرنا_مجانين_بسبب_هذه_الاغنية_🥹_#شربل_النجار_#shorts(128k).mp3';
  conn.sendPresenceUpdate('recording', m.chat);
  conn.sendMessage(m.chat, {audio: {url: vn}, ptt: true, mimetype: 'audio/mpeg', fileName: `deja de llorar.mp3`}, {quoted: m});
};

handler.help = ['notification']
handler.tags = ['notification']
handler.command = ['حبك','بحبك'] 
handler.customPrefix = /^(بحبك|حبك|حبي)$/i;
handler.command = new RegExp;
export default handler