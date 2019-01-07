#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const util = require('../util');

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('module', 'generate ES6')
  .example('$0 module -n module1', 'create module1')
  .alias('n', 'name')
  .nargs('n', 1)
  .describe('name', 'module name')
  .demandOption(['n'])
  .help('h')
  .alias('h', 'help')
  .argv;
