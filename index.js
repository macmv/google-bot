
const Discord = require('discord.js');
const request = require('request');
const config = require('./config.json');
const bot = new Discord.Client();

function search_image(term, msg, full) {
  var encoded_term = encodeURIComponent(term);
  console.log("Searching for " + encoded_term);
  request({
    uri: 'http://duckduckgo.com/?q=' + encoded_term + '&iax=images&ia=images'
  }, function(error, response, body) {
    var start = body.search("vqd");
    if (start == -1) {
      console.log("Could not find vqd!");
      msg.channel.send("Error loading your image!");
      return;
    }
    var vqd = body.substring(start + 5, start + 86);
    request({
      uri: 'https://duckduckgo.com/i.js?o=json&q=' + encoded_term + '&vqd=' + vqd
    }, function(error, response, body) {
      try {
        var data = JSON.parse(body);
      } catch {
        console.log("Could not parse json from i.js:\n" + body)
        msg.channel.send("Error loading your image!");
        return
      }
      if (data.results.length > 0) {
        var image;
        if (full) {
          image = data.results[0].image;
        } else {
          image = data.results[0].thumbnail;
        }
        const embed = new Discord.MessageEmbed().setImage(image);
        msg.channel.send(embed);
      } else {
        msg.channel.send("No results found!");
      }
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
      if (args.length == 1) {
        msg.channel.send("Please add a search term!");
        return;
      }
      args.splice(0, 1);
      search_image(args.join(" "), msg, false);
    } else if (args[0] == "imagef") {
      if (args.length == 1) {
        msg.channel.send("Please add a search term!");
        return;
      }
      args.splice(0, 1);
      search_image(args.join(" "), msg, true);
    }
  }
});

bot.login(config.token);
