const { Chess } = require('chess.js');
const uuid = require('uuid');

class ChessSession {
  static instance = null;

  static getInstance() {
    if (ChessSession.instance == null) {
      ChessSession.instance = new ChessSession();
    }

    return ChessSession.instance;
  }

  constructor() {
    this.games = [];
  }

  start(user) {
    let canStart = !this.games.some(game => game.hasPlayer(user));
    if (!canStart) {
      return 'you have an active game. Resign before starting another one, be fair to your opponent.';
    }

    let game = new ChessGame(user);
    this.games.push(game);

    return `you started a game with id ${game.gameId}. You are playing with white.`;
  }

  join(gameId, user) {
    let canJoin = !this.games.some(game => game.hasPlayer(user));
    if (!canJoin) {
      return 'you have an active game. Resign before joining another one, be fair to your opponent.';
    }

    let game = this.games.find(game => game.gameId === gameId);
    if (game === undefined) {
      return 'sorry even I can\'t find a game with that gameId.';
    }

    return game.join(user);
  }

  resign(user) {
    let gameIndex = this.games.findIndex(game => game.hasPlayer(user));
    if (gameIndex === -1) {
      return 'there is no game for you to resign, samurai!';
    }

    let game = this.games[gameIndex];
    this.games.splice(gameIndex, 1);

    return game.resign(user);
  }

  status(user) {
    let game = this.games.find(game => game.hasPlayer(user));
    if (game === undefined) {
      return {
        message: 'you have no active game at the moment. Maybe be the initiator for a change and start one?!',
      };
    }

    return game.status(user);
  }

  move(user, move) {
    let game = this.games.find(game => game.hasPlayer(user));
    if (game === undefined) {
      return 'you know you need a game to make a move right?';
    }

    return game.move(user, move);
  }

  finish(gameId) {
    let gameIndex = this.games.findIndex(game => game.gameId === gameId);
    this.games.splice(gameIndex, 1);
  }

  draw(user) {
    let game = this.games.find(game => game.hasPlayer(user));
    if (game === undefined) {
      return 'you are that kind of a person to be honest. You ask for a draw while not being in an active game.';
    }

    return game.draw(user);
  }
}

class ChessGame {
  constructor(whitePlayer) {
    this.gameId = uuid.v4();
    this.game = new Chess();

    this.whitePlayer = whitePlayer;
    this.blackPlayer;

    this.isWhite = true;

    this.whiteDraws = false;
    this.blackDraws = false;
  }

  hasPlayer(player) {
    return this.whitePlayer === player ||
      this.blackPlayer === player;
  }

  join(user) {
    this.blackPlayer = user;

    return `you are playing against ${this.whitePlayer}. Good luck!`;
  }

  resign(player) {
    if (this.whitePlayer === player) {
      if (this.blackPlayer === undefined) {
        return `you literally resigned a game with no opponent! What's wrong with you?`;
      }

      return `black wins! Congratulations, ${this.blackPlayer}.`;
    } else {
      return `white wins! Congratulations, ${this.whitePlayer}.`;
    }
  }

  status(player) {
    if (this.blackPlayer === undefined) {
      return {
        message: 'you are playing white in an opponentless game. You should really make some friends. Socialization is healthy for you humans.',
        fen: this.game.fen(),
      };
    }

    let message = player === this.whitePlayer ? `you are playing with white against ${this.blackPlayer}! It is ${this.isWhite ? 'white' : 'black'} to move.` :
      `you are playing with black against ${this.whitePlayer}! It is ${this.isWhite ? 'white' : 'black'} to move.`;

    return {
      message: message,
      fen: this.game.fen(),
    };
  }

  move(player, move) {
    if (this.blackPlayer === undefined) {
      return 'you can\'t play a move without an opponent. Simply put it\'s weird.';
    }

    let prioPlayer = this.isWhite ? this.whitePlayer : this.blackPlayer;
    let waitingPlayer = this.isWhite ? this.blackPlayer : this.whitePlayer;

    if (player !== prioPlayer) {
      return 'it is not your turn, friend!';
    }

    let recordedMove = this.game.move(move);

    if (recordedMove !== null) {
      this.isWhite = !this.isWhite;

      if (this.game.in_checkmate()) {
        let chessSession = ChessSession.getInstance();
        chessSession.finish(this.game);

        return `and that's the end of this game. Congratulations ${prioPlayer} for your well deserved victory!`;
      }

      if (this.game.in_stalemate()) {
        let chessSession = ChessSession.getInstance();
        chessSession.finish(this.game);

        return `${waitingPlayer}, what a tragic end to such a brilliant game! It was a draw. Stalemates are the worst.`;
      }

      if (this.game.in_threefold_repetition()) {
        let chessSession = ChessSession.getInstance();
        chessSession.finish(this.game);

        return `${waitingPlayer}, imagine finishing a game in repetition. You should be ashamed of yourselves.`;
      }

      if (this.game.in_draw()) {
        let chessSession = ChessSession.getInstance();
        chessSession.finish(this.game);

        return `${waitingPlayer}, the 50-mvoe rule or insufficient material are the bane of the world. We have a draw!`;
      }

      return `a move was made! ${waitingPlayer}, ${prioPlayer} played "${move}".`;
    } else {
      return `do you even know how to play chess? You clearly played an illegal move.`;
    }
  }

  draw(user) {
    if (this.blackPlayer === undefined) {
      return 'What in the name of the almighty is this? I\'ve never witnessed anyone asking for a draw in a game without an opponent.';
    }

    let otherPlayer = user === this.whitePlayer ? 
      this.blackPlayer : this.whitePlayer;

    if (user === this.whitePlayer) {
      this.whiteDraws = true;
    } else {
      this.blackDraws = true;
    }

    if (this.whiteDraws && this.blackDraws) {
      let chessSession = ChessSession.getInstance();
      chessSession.finish(this.gameId);

      return `${otherPlayer}, draw can also be a result.`;
    }

    return `offers you a draw, ${otherPlayer}. To accept it type "$chess draw".`;
  }
}

module.exports = ChessSession;