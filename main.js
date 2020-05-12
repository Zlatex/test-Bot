import * as botInfo from './botInfo.js'
import Telegraf  from 'telegraf';
import * as covid from './covid.js'
import fs from 'fs';

const token = botInfo.token

const bot = new Telegraf(token);
//https://api.covid19api.com/summary
const dtf = new Intl.DateTimeFormat('ua', { year: '2-digit', month: '2-digit', day: '2-digit' }) 
var postFun = async function (date=null,Confirmed,newConfirmed,Deaths,Recovered){
    if (date === null) return;
    var users = fs.readFileSync('./chats.json');
    users = JSON.parse(users)[0];
    const NowDATE = new Date();
    const leftDays = parseInt((botInfo.quarantineEndDate-NowDATE) / 60000 / 60 / 24)
    const [{ value: d },,{ value: m },,{ value: y }] = dtf.formatToParts(botInfo.quarantineEndDate); 
    users.forEach(async (id,index)=>{
        if (index % 10 === 0) await sleep(1000)
        const [{ value: da },,{ value: mo },,{ value: ye }] = dtf.formatToParts(new Date(date)); 

        bot.telegram.sendMessage(id,`
        Коронавірус в Україні станом на ${da}.${mo}.${ye}\n\nВсього: ${Confirmed}\nНових: ${newConfirmed}\nПомерло: ${Deaths}\
        \nВиліковано: ${Recovered}\n\nКарантин до ${d}.${m}.${y}(${leftDays} днів осталось)
        `)
    })
}
covid.Start(postFun,botInfo.Country);

setInterval(()=>covid.checkAndPost(postFun),60000)


var sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}


bot.launch()