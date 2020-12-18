module.exports = {
  name: 'help',
  description: 'Ask Mister Miracle about the commands!',
  execute(message, args) {
    let tag = message.guild.owner.roles.highest.toString();
    message.reply(`These are the currently available commands: $help, $ping, $count, $riddle. Don't blame me. Blame ${tag} if there are not enough commands to play around with`);
  },
};