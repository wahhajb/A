import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

let gameState = {};

const properties = [
    { name: "😎شـارع الاسـتـقـلال😎", price: 100, rent: 20 },
    { name: "🇵🇸شـارع فـلسـطـين🇵🇸", price: 120, rent: 25 },
    { name: "❤️شـارع العـرب❤️", price: 140, rent: 30 },
    { name: "🔵الـقـطـعة الـزرقاء🔵", price: 160, rent: 35 },
    { name: "🔰الـمـحـطة الـمـركـزية🔰", price: 200, rent: 40 },
    { name: "🪖الـحـديـقة الـوطـنية🪖", price: 220, rent: 45 },
    { name: "📜شـارع الـهـرم🔑", price: 240, rent: 50 },
    { name: "🌐شـارع الـنيـل🗾", price: 260, rent: 55 },
    { name: "🚵🏻المـديـنة الريـاضـية⛹🏻", price: 280, rent: 60 },
    { name: "🚨المـطـار الـدولـي🚁", price: 300, rent: 65 },
    { name: "🏪المـول الـتجـاري⛲", price: 320, rent: 70 },
    { name: "🌆سـاحة المـديـنة🌇", price: 340, rent: 75 },
    { name: "🗽ميـدان التـحـرير🗽", price: 360, rent: 80 },
    { name: "🏢شـارع الجـامـعة🏢", price: 380, rent: 85 },
    { name: "🏰المـسـرح الـوطني🏰", price: 400, rent: 90 },
    { name: "🛕المـتحف الـكبير🛕", price: 420, rent: 95 },
    { name: "⛱️شـارع الـبحر🧊", price: 440, rent: 100 },
    { name: "🛤️محـطة القـطار🛤️", price: 460, rent: 105 },
    { name: "🎡المـدينة التـرفيهية🎠", price: 480, rent: 110 },
    { name: "🏬السـوق الكـبير💺", price: 500, rent: 115 }
];

const initialCoins = 1500;

const createRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "في روم شغالة فعلا استخدم امر *.فركش* لو عايز تمسحها🫣" });
        return;
    }

    gameState[chatId] = {
        players: [],
        currentPlayerIndex: 0,
        started: false,
        board: Array(properties.length).fill(null)
    };

    await conn.sendMessage(chatId, { text: "ضن يبرو الروم جاهزة عشان تسجل نفسك لاعب استخدم *.دخول* مستني ايه😘" });
};

const joinRoom = async (chatId, conn, sender) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "مفيس رومات شغالة حاليا يسطى استخدم *.انشاء* عشان تعمل روم🧐" });
        return;
    }

    if (gameState[chatId].players.length >= 4) {
        await conn.sendMessage(chatId, { text: "الروم شبعت يسطى اسف😅" });
        return;
    }

    if (!gameState[chatId].players.find(p => p.id === sender)) {
        gameState[chatId].players.push({
            id: sender,
            position: 0,
            coins: initialCoins,
            properties: []
        });
        await conn.sendMessage(chatId, { text: `صاحبنا دا@${sender.split('@')[0]}دخل الروم😎`, mentions: [sender] });
    }
};

const rollDice = () => Math.floor(Math.random() * 6) + 1;

const playTurn = async (chatId, conn) => {
    if (!gameState[chatId]) return;

    const player = gameState[chatId].players[gameState[chatId].currentPlayerIndex];
    const diceRoll = rollDice();
    player.position = (player.position + diceRoll) % properties.length;
    const property = properties[player.position];
    
    let message = `-@${player.id.split('@')[0]}رمى النرد و طلع له  ${diceRoll}.-\n` +
                  `-الــمــكــان:- ${property.name}\n` +
                  `-ســعــر اــلــشــراء:- ${property.price}-عــمــلــة\n` +
                  `-ســعــر الــضــريــبــة:- ${property.rent}-عــمــلــة\n` +
                  `-الــمــحــفــظــة:- ${player.coins}-عــمــلــة\n`;

    if (gameState[chatId].board[player.position]) {
        message += `-المكان دا بتاع-@${gameState[chatId].board[player.position].split('@')[0]}.-`;
        if (gameState[chatId].board[player.position] !== player.id) {
            player.coins -= property.rent;
            const owner = gameState[chatId].players.find(p => p.id === gameState[chatId].board[player.position]);
            owner.coins += property.rent;
            message += `-دفــع- ${property.rent}-عــمــلــة كــضــريــبــة.-`;
        }
    } else {
        const imageUrl = 'https://telegra.ph/file/0c68c88f6849c58da7245.jpg';
        const imageMedia = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer });

        const buttonMessage = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            hasMediaAttachment: true,
                            ...imageMedia
                        },
                        body: {
                            text: message,
                            subtitle: "مونوبولي"
                        },
                        contextInfo: {
                            mentionedJid: [player.id],
                            isForwarded: true
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: `{"display_text":"شراء","id":".اشتري"}`
                                },
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: `{"display_text":"تخطي","id":".تخطي"}`
                                }
                            ]
                        }
                    }
                }
            }
        };

        await conn.relayMessage(chatId, buttonMessage, {});
        return;
    }

    await conn.sendMessage(chatId, { text: message, mentions: [player.id, gameState[chatId].board[player.position]] });
    gameState[chatId].currentPlayerIndex = (gameState[chatId].currentPlayerIndex + 1) % gameState[chatId].players.length;
    await playTurn(chatId, conn);
};

const checkAction = async (chatId, conn, sender, action) => {
    if (!gameState[chatId]) return;

    const player = gameState[chatId].players[gameState[chatId].currentPlayerIndex];
    if (player.id !== sender) {
        await conn.sendMessage(chatId, { text: "مش دورك يسطى اصبر🥱" });
        return;
    }

    const property = properties[player.position];
    if (action === 'اشتري') {
        if (player.coins >= property.price) {
            player.coins -= property.price;
            player.properties.push(player.position);
            gameState[chatId].board[player.position] = player.id;
            await conn.sendMessage(chatId, { text: `-@${player.id.split('@')[0]}-اشــتــرى- ${property.name} -مــقــابــل- ${property.price}-عــمــلــة.- 🏠-`, mentions: [player.id] });
        } else {
            await conn.sendMessage(chatId, { text: "-مش معاك فلوس تكفي تشتري يسطى💸-" });
        }
    } else if (action === 'تخطي') {
        await conn.sendMessage(chatId, { text: `-@${player.id.split('@')[0]}-تــخــطــى هــذه الــفــرصــة.- ➡️ -`, mentions: [player.id] });
    }

    gameState[chatId].currentPlayerIndex = (gameState[chatId].currentPlayerIndex + 1) % gameState[chatId].players.length;
    await playTurn(chatId, conn);
};

const deleteRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        delete gameState[chatId];
        await conn.sendMessage(chatId, { text: "-ضن ياكبير الروم اتمسحت.- 🗑️-" });
    } else {
        await conn.sendMessage(chatId, { text: "-مفيش روم حاليا يسطى.- 🤔-" });
    }
};

const explainGame = async (chatId, conn) => {
    const explanation = `أهــلًا بــك فــي لــعــبــة مــونــوبــولــي! هــذه هــي الــتــعــلــيــمــات:

1.- اســتــخــدم الأمــر'.انشاء' لــإنــشــاء غــرفــة جــديــدة.
2.- اســتــخــدم الأمــر '.دخول' للانــضــمــام إلــى الــغــرفــة.
3.- اســتــخــدم الأمــر'.ابدأ'لــبــدء اللــعــبــة بــعــد انــضــمــام اللاعــبــيــن.
4.- اســتــخــدم الأمــر '.رمي'لــرمــي الــنــرد وتــحــديــد خــطــواتــك. *(تـتـم تـلـقائـيـاََ)*
5.-عــنــدمــا تــقــف عــلــى عــقــار، يــمــكــنــك اســتــخــدام'.اشتري'لــشــراء الــعــقــار أو '.تخطي' لــتــخــطــي الــفــرصــة. *(تـتـم بالازرار)*
6.- إذا وقــفــت عــلــى عــقــار يــمــتــلــكــه لــاعــب آخــر، يــجــب عــلــيــك دفــع ضــريــبــة.
7.- اللاعــب الــذي يــخــرج مــن الــلــعــبــة عــنــدمــا يــفــلــس. الــفــائــز هــو آخــر لــاعــب يــبــقــى فــي اللــعــبــة أو الأغــنــى.- 🤓`;

    await conn.sendMessage(chatId, { text: explanation });
};

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;
    const sender = m.sender;

    if (command === 'انشاء') {
        await createRoom(chatId, conn);
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender);
    } else if (command === 'ابدأ') {
        if (gameState[chatId] && gameState[chatId].players.length > 1) {
            gameState[chatId].started = true;
            await conn.sendMessage(chatId, { text: "اللعبة بدأت دور اول لاعب 🎲-" });
            await playTurn(chatId, conn);
        } else {
            await conn.sendMessage(chatId, { text: "لازم عشان تلعب يكون في اتنين على الاقل😞-" });
        }
    } else if (command === 'رمي') {
        if (gameState[chatId] && gameState[chatId].started) {
            await playTurn(chatId, conn);
        } else {
            await conn.sendMessage(chatId, { text: "اللعبة مبدأتش لسة عشان تبدأ استخدم الامر *.ابدأ* يلا بينا🫣-" });
        }
    } else if (command === 'اشتري' || command === 'تخطي') {
        if (gameState[chatId] && gameState[chatId].started) {
            await checkAction(chatId, conn, sender, command);
        } else {
            await conn.sendMessage(chatId, { text: "اللعبة مبدأتش لسة عشان تبدأ استخدم الامر *.ابدأ* يلا بينا🫣-" });
        }
    } else if (command === 'فركش') {
        await deleteRoom(chatId, conn);
    } else if (command === 'شرح_مونوبلي') {
        await explainGame(chatId, conn);
    }
};

handler.help = ['انشاء', 'دخول', 'ابدأ', 'رمي', 'شراء', 'تخطي', 'فركش', 'شرح_مونوبلي'];
handler.tags = ['game'];
handler.command = /^(انشاء|دخول|ابدأ|رمي|اشتري|تخطي|فركش|شرح_مونوبلي)$/i;

export default handler;