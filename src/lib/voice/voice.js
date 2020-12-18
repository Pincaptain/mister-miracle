const ytdl = require('ytdl-core');

class VoiceState {
  static instance = null;

  static getInstance() {
    if (VoiceState.instance == null) {
      VoiceState.instance = new VoiceState();
    }

    return VoiceState.instance;
  }

  constructor() {
    this.connection = null;
    this.queue = [];
  }

  async join(member) {
    let channel = member.voice.channel;
    if (!channel) return 'please join a voice channel first.';
    if (this.inChannel(member)) return 'are you blind? I\'m already in your channel!';
    if (this.inUse()) return 'I\'m already in use.';

    this.connection = await channel.join();
    
    return 'why didn\'t you call me earlier. It is very cosy in here.';
  }

  leave(member) {
    let channel = member.voice.channel;
    if (!channel) return 'please join a voice channel first.';
    if (!this.inUse()) return 'why should I leave if I was never invited?';
    if (!this.inChannel(member)) return 'you are literally trying to kick me from a channel you are not a part of.';

    this.connection.disconnect();
    this.connection = null;

    return 'you know it is not my fault you do not like the song. But whatever I will leave anyway.';
  }

  async play(member, audio) {
    let channel = member.voice.channel;
    if (!channel) return 'please join a voice channel first.';

    if (!this.inUse()) {
      await this.join(member);
    }

    if (!this.inChannel(member)) return 'we are not in the same voice channel.';

    this.queue.push(audio);

    if (this.queue.length !== 1) return `${audio} was added to the audio queue.`;

    let dispatcher = this.connection.play(ytdl(audio, {filter: 'audioonly'}));
    dispatcher.on('finish', () => {
      let nextAudio = this.queue.shift();
      if (nextAudio === undefined) {
        return;
      }

      dispatcher = this.connection.play(ytdl(nextAudio, {filter: 'audioonly'}));
    });

    return `now playing ${audio}. Take it away, honey!`;
  }

  inUse() {
    if (this.connection === null) {
      return false;
    }

    if (this.connection.status === 4) {
      this.connection = null;
      return false;
    }

    return true;
  }

  inChannel(member) {
    if (!this.inUse()) {
      return false;
    }

    let inChannel = false;

    this.connection.channel.members.forEach(m => {
      if (m.user.id === member.user.id) {
        inChannel = true;
      }
    });

    return inChannel;
  }
}

module.exports = VoiceState;