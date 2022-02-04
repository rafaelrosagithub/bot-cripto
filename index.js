// BTCBUSD
// 36291 
// 35764


// https://api.telegram.org/bot<here you put your token>/getUpdates
// https://api.telegram.org/bot5176584454:AAFYTvIO2WnaVTSx2AbIS7hd-Bsl75CU-MA/getUpdates

const TOKEN = "<here you put your token>";
const CHAT_ID = 1076345056;
let lastmessage = "";

function calcRSI(closes) {
    console.log("calcRSI()");
    let altas = 0;
    let baixas = 0;

    for (let i = closes.length - 15; i < closes.length - 1; i++) {
        const diferenca = closes[i] - closes[i - 1];
        if (diferenca >= 0) {
            altas += diferenca;
        } else {
          baixas -= diferenca;  
        }
    }

    const forcaRelativa = altas / baixas;
    return 100 - (100 / (1 + forcaRelativa));
}

async function process() {
    console.log("process()");
    const { Telegraf } = require("telegraf");
    const bot = new Telegraf(TOKEN);

    const axios = require("axios");

    const response = await axios.get("https://api.binance.com/api/v3/klines?symbol=BTCBUSD&interval=1m");
    const candle = response.data[499];
    const price = parseFloat(candle[4]);

    const closes = response.data.map(candle => parseFloat(candle[4]));
    const rsi = calcRSI(closes);
    console.log("RSI: " + rsi);
    console.log("Preço: " + price);

    if (rsi >= 70 && lastmessage !== "Sobrecomprado") {
        lastmessage = "Sobrecomprado";
        console.log(lastmessage);  
        bot.telegram.sendMessage(CHAT_ID, lastmessage);
    } else if (rsi <= 30 && lastmessage !== "Sobrevendido") {
        lastmessage = "Sobrevendido";
        console.log(lastmessage)
        bot.telegram.sendMessage(CHAT_ID, lastmessage);
    } 
}

setInterval(process, 2000);

process();
