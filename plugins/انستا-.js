import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
    
    if (!args[0]) {
        throw `من فضلك، أدخل رابط Instagram لتنزيل من.🦋`;
    }

    try {
        const apiUrl = `${apikasu}/api/dowloader/instagram?url=${args[0]}&apikey=${apikeykasu}`;
        const response = await fetch(apiUrl);
        const responseData = await response.json();

        m.react(rwait);

        if (responseData.status && responseData.result.length > 0) {
            for (const media of responseData.result) {
                m.react(done);
                await conn.sendFile(m.chat, media, media.includes('.mp4') ? 'video.mp4' : 'imagen.jpg', '', m);
            }
        } else {
            throw `
> بدون رد، لن تتمكن من الحصول على محتوى Instagram.🦋`;
        }
    } catch (error) {
        console.error(error);
        throw `
> Sin respuesta

Ocurrió un error al procesar la solicitud: ${error.message}`;
    }
};

handler.help = ['instagram'];
handler.tags = ['dl'];
handler.command = /^(انستا|instagram|igdl|ig)$/i;

export default handler;