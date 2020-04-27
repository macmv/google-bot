
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();

function search_image() {
  return "GAMER";
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content[0] == config.prefix) {
    args = msg.content.substring(1).split(" ");
    if (args[0] == "image") {
      url = search_image(args[1]);
      msg.channel.send(url);
    }
  }
});

bot.login(config.token);
