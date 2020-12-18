const bent = require('bent');
const parser = require('node-html-parser');

class Scraper {
  static instance = null;

  static getInstance() {
    if (Scraper.instance == null) {
      Scraper.instance = new Scraper();
    }

    return Scraper.instance;
  }

  async getRiddle() {
    const getStream = bent('https://www.generatormix.com/');

    let stream = await getStream('/random-riddles');
    let html = await stream.text();
    let root = parser.parse(html);
    let element = root.querySelector('.first');
    let riddle = element.querySelector('p').rawText;
    let answer = element.querySelectorAll('p')[1].rawText;

    return {
      riddle: riddle,
      answer: answer,
    };
  }
}

module.exports = Scraper;