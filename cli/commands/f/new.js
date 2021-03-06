'use strict';

const Command = require('cmnd').Command;
const path = require('path');
const fs = require('fs');
const async = require('async');
const APIResource = require('api-res');
const Credentials = require('../../credentials.js');

class FNewCommand extends Command {

  constructor() {

    super('f', 'new');

  }

  help() {

    return {
      description: 'Creates an index.js, package.json and env.json file in the current directory'
    };

  }

  run(params, callback) {

    let indexPath = path.join(process.cwd(), 'index.js');
    let packagePath = path.join(process.cwd(), 'package.json');
    let envPath = path.join(process.cwd(), 'env.json');
    let gitignorePath = path.join(process.cwd(), '.gitignore');

    let name = params.args[0];

    if (!name) {
      return callback(new Error('No name specified. Expecting <username>/<namespace>/<name>.'));
    }

    if (fs.existsSync(indexPath)) {
      return callback(new Error('File "index.js" already exists.'));
    }

    if (fs.existsSync(packagePath)) {
      return callback(new Error('File "package.json" already exists.'));
    }

    if (fs.existsSync(envPath)) {
      return callback(new Error('File "env.json" already exists.'));
    }

    fs.writeFileSync(indexPath, [
      'module.exports = (params, callback) => {',
      '  // Node version: 6.5.0',
      '  // params has keys: {args, flags, vflags, env, remoteAddress}',
      '  let a = parseInt(params.args[0]) || 0;',
      '  let b = parseInt(params.args[1]) || 0;',
      '  let name = params.kwargs.name || \'World\';',
      '  // Once this function has compiled, try executing it with:',
      '  //   f <username>/dev/hello 1 2 --name Name',
      '  return callback(null, `Hello ${name}, ${a} + ${b} = ${a + b}`);',
      '};'
    ].join('\n'));

    fs.writeFileSync(packagePath, JSON.stringify({"name": name}, null, 2));
    fs.writeFileSync(envPath, JSON.stringify({"sample_key": "value"}, null, 2));

    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, [
        '.DS_Store',
        'node_modules/',
        '.stdlib',
        '/env.json'
      ].join('\n'));
    }

    callback(null, `Function "${name}" ready for local development!`);

  }

}

module.exports = FNewCommand;
