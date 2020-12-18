const { generateBotIntro } = require("../functions/common");

module.exports = {
  name: 'count',
  description: 'Return the server member count.',
  execute(message, args) {
    const members = message.guild.memberCount;
    message.reply(`${generateBotIntro()} There are currently ${members} members.`);
  },
};