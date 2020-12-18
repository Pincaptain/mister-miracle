function generateBotIntro() {
  const botIntros = [
    'I\'m always happy to help you!',
    'I am at your service.',
    'pleased as always!',
    'cheers darlin\'.',
    'I am burnin\' for you!',
    'you are my favorite faded fantasy!',
    'R U mine?',
    'don\'t fear the reaper!',
    'take my hand.',
    'then came the last days of may.',
    'it is a wicked game we play.',
    'why\'d you only call me when you\'re high?',
    'there is a light that never goes out!',
    'like a rolling stone!',
    'what an imitation of life!',
    'heaven knows I am miserable now.',
    'you are very special to me you know that, right?',
    'high hopes.',
    'son of a preacher man',
    'why so mardy?',
    'are you the veteran of the psychic wars?',
    'Arabella?',
    'you look wonderful tonight!',
    'by my side!',
  ];

  return botIntros[Math.floor(Math.random() * botIntros.length)];
}

function randomReact(message, username) {
  if (message.author.username === username) {
    const randomEmoji = message.guild.emojis.cache.random();
    message.react(randomEmoji);
  }
}

module.exports = {
  randomReact: randomReact,
  generateBotIntro: generateBotIntro,
};