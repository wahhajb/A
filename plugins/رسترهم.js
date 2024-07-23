import { createHash } from 'crypto';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let deletedUsers = [];
    let users = global.db.data.users;

    for (let user in users) {
      if (users[user].level < 4) {
        delete users[user];
        deletedUsers.push(user);
      }
    }

    if (deletedUsers.length === 0) {
      conn.reply(m.chat, `*🐍 مفيش اقل من 4*`, m);
    } else {
      let userList = deletedUsers.map(user => `@${user.split('@')[0]}`).join(', ');
      conn.reply(m.chat, `*🐍 العقرب يقول لكم باي باي\n${userList}`, null, { mentions: deletedUsers });
    }
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `*فيه غلط هنا: ${e.message}*`, m);
  }
};

handler.help = ['owner'];
handler.tags = ['owner'];
handler.command = ['رسترهم']; 
handler.rowner = true;

export default handler;