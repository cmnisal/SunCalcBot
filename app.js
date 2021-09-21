require('dotenv').config()

const { Telegraf } = require('telegraf');
const bot = new Telegraf((process.env.BOT_TOKEN));
var SunCalc = require('suncalc');
const geoTz = require('geo-tz')


//method for invoking start command
 
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name}\nWelcome to Sun Calc Bot,\n\nI can fetch data from suncalc.org based on location, you just have to send any location or if you click the button below, I can obtain your current location.\n\n Report any Bugs to @CMNisalBot`, requestLocationKeyboard);

})

//method for requesting user's location

bot.command("getsun", (ctx) => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
})
//constructor for proving location to the bot

bot.on('location', (ctx) => {
    console.log(ctx.update.message.location);
    var long = ctx.update.message.location.longitude;
    var lat = ctx.update.message.location.latitude;
    // get today's sunlight times for London
    
    console.log(geoTz(lat, long));
    var d = new Date();
    d.toLocaleString('en-US', { timeZone: geoTz(lat, long) })
    var times = SunCalc.getTimes(d, lat, long);

    // format sunrise time from the Date object
    var sunriseStr = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
    
    // get position of the sun (azimuth and altitude) at today's sunrise
    var sunrisePos = SunCalc.getPosition(times.sunrise, 51.5, -0.1);
    
    // get sunrise azimuth in degrees
    var sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;
    
    // Using context shortcut
    console.log(times);
    ctx.reply(`Hello ${ctx.from.first_name}\n
    🌞 Solar Noon   - ${times.solarNoon.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n
    🌅 Sunrise      - ${times.sunrise.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n\n
    🌤 Sunset        - ${times.sunset.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n
    🌤 SunsetStart   - ${times.sunsetStart.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n
    🌤 SunriseEnd    - ${times.sunriseEnd.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n\n
    🌉 GoldenHour    - ${times.goldenHour.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n
    🌉 GoldenHourEnd - ${times.goldenHourEnd.toLocaleString('en-US', { timeZone: geoTz(lat, long) }) }\n`);    
    
    // ctx.reply(`Hello ${ctx.from.first_name}\n
    // solarNoon - ${times.solarNoon}\n
    // nadir   - ${times.nadir}\n
    // sunrise   - ${times.sunrise}\n
    // sunset   - ${times.sunset}\n
    // sunriseEnd   - ${times.sunriseEnd}\n
    // sunsetStart   - ${times.sunsetStart}\n
    // goldenHourEnd   - ${times.goldenHourEnd}\n
    // goldenHour   - ${times.goldenHour}\n`)
  })

const requestLocationKeyboard = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My location",
                request_location: true,
                one_time_keyboard: true
            }]
        ]
    }

}


//method to start get the script to pulling updates for telegram 

bot.launch();
