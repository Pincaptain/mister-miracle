const Discord = require('discord.js');
const config = require('config');
const fs = require('fs');
const fcns = require('./functions/common');
const Logger = require('./lib/logger/logger');
const chalk = require('chalk');

const operational = true;
const logger = Logger.getInstance();
const client = new Discord.Client();

client.commands = new Discord.Collection();

fs.readdirSync('./commands')
  .filter(file => file.endsWith('js'))
  .forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  });

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

client.on('message', message => {
  logger.message(message.content, message.author.username);
  
  fcns.randomReact(message, 'Azure - Disco');
  fcns.randomReact(message, 'Samuru');

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  if (!operational) {
    let tag = message.guild.owner.roles.highest.toString();
    message.reply(`I\'m not doing shit until ${tag} returns and currently he is not available! Now If you excuse me must return to my administration duties.`);

    return;
  }

  // const connection = await message.member.voice.channel.join();
  // connection.channel.members.each(member => member.user.username);

  try {
    client.commands.get(command).execute(message, args);
  } catch (err) {
    logger.err(err.message);
    message.reply('There was an issue executing this command!');
  }
});

client.login(config.token);