const { TelegramAPI } = require("raccoonjs-api");
const M = require("raccoonjs-api/Markup");

const { BOT_TOKEN, BOT_HOST, PORT } = process.env;

// BOT_HOST : https://<app-name>.herokuapp.com:443/
const bot = new TelegramAPI(BOT_TOKEN, BOT_HOST);

bot.startWebhook(`/${BOT_TOKEN}`, PORT, () => console.log("Bot started!"));

bot.cmd("start", ctx => {
    const { chat } = ctx;
    const text = `Hello, ${chat.first_name}. This bot is made by using ${M.link(
        "raccoonjs-api",
        "https://github.com/josestg/raccoonjs-api"
    )}\n\nCommands:\n1. This message ${M.bold("/start")}\n2. Grid demo ${M.bold("/btn")}\n3. Test send photo ${M.bold(
        "/img"
    )}`;
    bot.sendText(chat.id, text, { parse_mode: "Markdown" });
});

bot.cmd("btn", ctx => {
    const { chat } = ctx;
    const keyboards = new M.Gird(2, 2)
        .put(0, 0, M.btn("Button A", "A"))
        .put(0, 1, M.btn("Button B", "B"))
        .put(1, 0, M.btn("Button C", "C"))
        .put(1, 1, M.btn("Button D", "D"))
        .push([M.btn("Submit", "ok")]).value;

    const options = { parse_mode: "Markdown", reply_markup: keyboards };

    bot.sendText(chat.id, "Grid demo.", options);
});

bot.cmd("img", ctx => {
    const { chat } = ctx;
    bot.sendPhoto(chat.id, "./img/test.png", { caption: "Test image caption" });
});

bot.on("callback_query", query => {
    const { message } = query;
    if (query.data == "ok") {
        bot.deleteText(message.chat.id, message.message_id);
        return;
    }

    bot.answerCallbackQuery(query.id, query.data + "😊");
});
