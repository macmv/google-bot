
const Discord = require('discord.js');
const request = require('request');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const config = require('./config.json');
const bot = new Discord.Client();

function search_image(term, msg) {
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
        image = data.results[0].image;
        msg.channel.send({files: [image]});
      } else {
        msg.channel.send("No results found!");
      }
    });
  });
}

async function run_eval(text, msg) {
  try {
    text = text.replace(/"/g, '\\"');
    const { stdout, stderr } = await exec("node -e \"" + text + "\"");
    output = stdout.trim();
    if (output == '' || output == undefined) {
      msg.channel.send("Your command generated no output!");
    } else {
      msg.channel.send(output);
    }
  } catch (err) {
    console.error(err);
    msg.channel.send("There was an error while running your command!");
  };
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content[0] == config.prefix) {
    args = msg.content.substring(1).split(" ");
    func = args[0];
    args.splice(0, 1);
    if (func == "image") {
      if (args.length == 1) {
        msg.channel.send("Please add a search term!");
        return;
      }
      search_image(args.join(" "), msg);
    } else if (func == "eval") {
      text = args.join(" ");
      run_eval(text, msg);
    }
  }
});

bot.login(config.token);
