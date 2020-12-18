const ChessSession = require("../lib/chess/chess");

module.exports = {
  name: 'chess',
  description: 'Play chess from the comfort of your discord server.',
  execute(message, args) {
    let chessSession = ChessSession.getInstance();
    let user = message.author;

    if (args.length > 0) {
      let action = args[0];

      switch (action) {
        case 'resign':
          message.reply(chessSession.resign(user));
          break;

        case 'start':
          message.reply(chessSession.start(user));
          break;

        case 'join':
          if (args.length < 2) {
            message.reply('please specify the gameId of the game you wish to join.');
            break;
          }

          let gameId = args[1];
          message.reply(chessSession.join(gameId, user));
          break;

        case 'status':
          let status = chessSession.status(user);
          message.reply(status.message);

          if (status.fen !== undefined) {
            status.fen = status.fen.trim().replace(/\s/g, '%20');
            message.channel.send(`https://chessboardimage.com/${status.fen}.png`);
          }

          break;

        case 'move':
          if (args.length < 2) {
            message.reply('please specify the move you want to make!');
            break;
          }

          let move = args[1];
          message.reply(chessSession.move(user, move));
          break;

        case 'draw':
          message.reply(chessSession.draw(user));

        default:
          break;
      }
    } else {
      message.reply('insufficient amount of arguments provided. Please specify your action.');
    }
  },
};