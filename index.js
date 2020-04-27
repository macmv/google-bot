
const Discord = require('discord.js');
const request = require("request");
const fs = require('fs');
const config = require('./config.json');
const bot = new Discord.Client();

function search_image(term, msg) {
  console.log("Searching for " + term);
  request({
    uri: 'http://duckduckgo.com/?q=' + term + '&iax=images&ia=images'
  }, function(error, response, body) {
    var start = body.search("vqd");
    var vqd = body.substring(start + 5, start + 86);
    request({
      uri: 'https://duckduckgo.com/i.js?o=json&q=' + term + '&vqd=' + vqd
    }, function(error, response, body) {
      var data = JSON.parse(body);
      var image = data.results[0].image;
      const embed = new Discord.MessageEmbed()
        .setImage(image);
      msg.channel.send(embed);
    });
  });
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content[0] == config.prefix) {
    args = msg.content.substring(1).split(" ");
    if (args[0] == "image") {
      search_image(args[1], msg);
    }
  }
});

bot.login(config.token);
