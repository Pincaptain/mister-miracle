const { generateBotIntro } = require("../functions/common");
const Scraper = require("../lib/scrapper/scrapper");

module.exports = {
  name: 'riddle',
  description: 'Ask Mister Miracle for a riddle!',
  async execute(message, args) {
    let scraper = Scraper.getInstance();
    let riddle = await scraper.getRiddle();
    let defaultTimeout = 15000;
    let timeout = defaultTimeout;

    if (args.length > 0) {
      timeout = parseInt(args[0]);
      timeout = timeout === NaN ? 15000 : timeout * 1000;
    }

    message.reply(riddle.riddle);

    setTimeout(() => {
      message.reply(`${generateBotIntro()} The answer, of course, is ${riddle.answer}.`);
    }, timeout);
  },
};