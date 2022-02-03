// BTCBUSD
// 36291 
// 35764


// https://api.telegram.org/bot<here you put your token>/getUpdates

const TOKEN = "<here you put your token>";
const CHAT_ID = 1036917056;
let lastmessage = "";

async function process() {
    const { Telegraf } = require("telegraf");
    const bot = new Telegraf(TOKEN);

    const axios = require("axios");

    const response = await axios.get("https://api.binance.com/api/v3/klines?symbol=BTCBUSD&interval=1m");
    const candle = response.data[499];
    const price = parseFloat(candle[4]);
    if (price >= 36291 && lastmessage !== "Time to sell!") {
        lastmessage = "Time to sell!";
        console.log(lastmessage);  
        bot.telegram.sendMessage(CHAT_ID, lastmessage);
    } else if (price <= 35764 && lastmessage !== "Time to buy!") {
        lastmessage = "Time to buy!";
        console.log(lastmessage)
        bot.telegram.sendMessage(CHAT_ID, lastmessage);
    } else {
        console.log("Wait...");
    }
    console.log(candle[4]);
}

setInterval(process, 1000);

process();
