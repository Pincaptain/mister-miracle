const fs = require('fs');
const chalk = require('chalk');

class Logger {
  static instance = null;

  static getInstance() {
    if (Logger.instance == null) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  info(message) {
    let date = Date();
    let type = 'INFO';
    let entry = {
      message: message,
      date: date,
      type: type
    };

    console.log(`${chalk.yellow(type)} :: ${message} - ${date}`);

    this.store(entry);
  }

  success(message) {
    let date = Date();
    let type = 'SUCCESS';
    let entry = {
      message: message,
      date: date,
      type: type,
    }

    console.log(`${chalk.green(type)} :: ${message} - ${date}`);

    this.store(entry);
  }

  err(message) {
    let date = Date();
    let type = "ERROR";
    let entry = {
      message: message,
      date: date,
      type: type
    };

    console.log(`${chalk.red(type)} :: ${message} - ${date}`);

    this.store(entry);
  }

  message(message, user) {
    let date = Date();
    let type = 'MESSAGE';
    let entry = {
      message: message,
      user: user,
      date: date,
      type: type
    };

    console.log(`${chalk.blue(type)} :: ${message}/${user} - ${date}`);

    this.store(entry);
  }

  store(entry) {
    let path = `${__dirname}/../../../logs/log.json`;

    fs.access(path, fs.constants.F_OK, (err) => {
      let exists = err ? false : true;
      let json = [];

      if (exists) {
        fs.readFile(path, (err, data) => {
          if (err) throw err;

          if (data.length !== 0) {
            json = JSON.parse(data);
          }

          json.push(entry);

          fs.writeFile(path, JSON.stringify(json), (err) => {
            if (err) throw err;
          });
        });
      } else {
        json.push(entry);

        fs.writeFile(path, JSON.stringify(json), (err) => {
          if (err) throw err;
        });
      }
    });
  }
}

module.exports = Logger;