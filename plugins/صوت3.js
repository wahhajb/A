let handler = async (m, { conn, usedPrefix, __dirname, text, isPrems }) => {

    const vn = './media/حالات_واتس_بهجت_صابر(128k).mp3';
  conn.sendPresenceUpdate('recording', m.chat);
  conn.sendMessage(m.chat, {audio: {url: vn}, ptt: true, mimetype: 'audio/mpeg', fileName: `deja de llorar.mp3`}, {quoted: m});
};

handler.help = ['notification']
handler.tags = ['notification']
handler.command = ['قالو اي','خول'] 
handler.customPrefix = /^(خول|ياخول|قالو اي)$/i;
handler.command = new RegExp;
export default handler