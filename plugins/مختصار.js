import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, command }) => {
  try {
    if (command === 'اختصار' && text) {
      const url = text.trim();
      if (!url) return m.reply('💬 يرجى توفير رابط لاختصاره.');

      const response = await fetch(`https://api.tinyurl.com/create?api_token=zu8tAv7kMMZMnbiTdUuuo5jhHfJO3AkR48m3FGnNCkMJ4JZHvhzd8f378ShD`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          domain: 'tiny.one'
        })
      });

      const data = await response.json();

      if (data.data && data.data.tiny_url) {
        m.reply(`🐍 الرابط المختصر: ${data.data.tiny_url}`);
      } else {
        m.reply('🤷🏻‍♂️حدث خطأ أثناء اختصار الرابط.');
      }
    } else {
      m.reply(`🤷🏻‍♂️ الاستخدام: ${usedPrefix}اختصار (الرابط)`);
    }
  } catch (error) {
    console.error('حدث خطأ:', error);
    m.reply('🫡 حدث خطأ أثناء معالجة طلبك.');
  }
};

handler.command = ['اختصار'];
handler.tags = ['tools'];

export default handler;