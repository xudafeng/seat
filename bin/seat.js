#!/usr/bin/env node

'use strict';

var seat = require('..');
var program = require('commander');

var pkg = require('../package');

program
  .option('-v, --versions', 'print put version infomation')
  .option('-o, --owner [owner]', 'set the owner of package')
  .parse(process.argv);

if (program.versions) {
  console.info('\n  ' + pkg.version + '\n');
} else {
  seat({
  	owner: program.owner || 'xudafeng',
  	name: program.args[0],
  });
}
