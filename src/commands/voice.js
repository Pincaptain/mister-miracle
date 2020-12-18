const VoiceState = require("../lib/voice/voice");

module.exports = {
  name: 'voice',
  description: 'Voice related commands for Mister Miracle!',
  async execute(message, args) {
    if (args.length < 1) {
      message.reply('just typing "$voice" is not enough. Try using an operation like "$voice join" for example.');
      return;
    }

    let voiceState = VoiceState.getInstance();
    let member = message.member;

    let operation = args[0];
    switch (operation) {
      case 'join':
        message.reply(await voiceState.join(member));
        break;

      case 'leave':
        message.reply(voiceState.leave(member));
        break;

      case 'play':
        if (args.length < 2) {
          message.reply('play takes 3 arguments. Please provide the audio.');
          return;
        }

        let audio = args[1];

        await voiceState.play(member, audio, message);
        break;
    }
  },
};