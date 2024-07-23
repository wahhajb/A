let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, '❐┃لم يتم الاجابة علي السؤال بعد┃❌ ❯', conn.tebakbendera[id][0])
        throw false
    }
    let src = await (await fetch('https://gist.githubusercontent.com/Kyutaka101/4e01c190b7d67225ad7a86d388eeedf6/raw/67f0de059cea4b965a3f3bf211c12fc9c48043e5/gistfile1.txt')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*${command.toUpperCase()}*
    الـوقـت⏳↞
    ╯────────────────⟢ـ
    *${(timeout / 1000).toFixed(2)} 
  *استخدم .انسحب للأنسحاب*
  ╯────────────────⟢ـ
  ↞الـجـائـزة💰↞ ${poin} نقاط
  ╯────────────────⟢ـ
*بوت العقرب اليوتيوبر*
     `.trim()
    conn.tebakbendera[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakbendera[id]) conn.reply(m.chat, `❮ ⌛انتهي الوقت⌛❯
            ╯────────────────⟢ـ
            \n↞الاجـابـة✅↞ ${json.name}*
            ╯────────────────⟢ـ`, conn.tebakbendera[id][0])
            delete conn.tebakbendera[id]
        }, timeout)
    ]
}
handler.help = ['عين']
handler.tags = ['fun']
handler.command = /^عين/i

export default handler