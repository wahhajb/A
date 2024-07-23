let handler = async (m, { conn }) => {
    let vn = "./vn/ara.mp3"
	conn.sendFile(m.chat, vn, "lh.mp3", null, m, true, {
		type: "audioMessage",
		ptt: true,
	});
};
handler.customPrefix = /^(Ara ara|ara ara|ara-ara)$/i;
handler.command = new RegExp();

export default handler;