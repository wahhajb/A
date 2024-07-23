import fetch from 'node-fetch';

let elementHandler = async (m, { conn, text }) => {

if (!text) throw `ابعت اسم المعنصر الكميائي: مثال . كيمياء carbon `;

try {

let res = await fetch(`https://api.popcat.xyz/periodic-table?element=${text}`);

if (!res.ok) {

throw new Error(`API request failed with status ${res.status}`);

}

let buffer = await res.arrayBuffer();

let json = JSON.parse(Buffer.from(buffer).toString());

console.log('JSON response:', json);

let elementInfo = 

`*معلومات العنصر:*\n

• *الاسم:* ${json.name}\n

• *رمز:* ${json.symbol}\n

• *العدد الذري:* ${json.atomic_number}\n

• *الكتلة الذرية:* ${json.atomic_mass}\n

• *فترة:* ${json.period}\n

• *مرحلة:* ${json.phase}\n

• *أكتشف من قبل:* ${json.discovered_by}\n

• *ملخص:* ${json.summary}`;

conn.sendFile(m.chat, json.image, 'element.jpg', elementInfo, m);

} catch (error) {

console.error(error);

// Handle the error appropriately

}

};

elementHandler.help = ['element'];

elementHandler.tags = ['tools'];

elementHandler.command = /^(كيمياء|ele)$/i;

export default elementHandler