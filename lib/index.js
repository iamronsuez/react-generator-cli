#!/usr/bin/env node --harmony
/**
 * Module dependencies.
 */

var {includes, get} = require('lodash');
var program = require('commander');
var CommandParser = require('./program')

const helperLibrary = new CommandParser({ 
  rootDirName: '.output', 
  pagesDirName: 'pages', 
  componentsDirName: 'components'
})

program
  .version('0.0.1')

program
  .command('page [name]')
  .option('-a, --auth [auth]', 'Requires Auth', false)
  .action((name, options) => helperLibrary.getAction('page', {name, ...options}))

program
  .command('component [name]')
  .option('-s, --stateless [stateless]', 'Stateless Component option', false)
  .action((name, options) => helperLibrary.getAction('component', {name, ...options}))

program.parse(process.argv)
