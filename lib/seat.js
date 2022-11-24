'use strict';

var fs = require('fs');
var path = require('path');
var dirutil = require('dirutil');
var exec = require('child_process').exec;
var render = require('microtemplate').render;

module.exports = function(options) {
  // global data

  var data = options;
  // get time
  var time = data.time = new Date();
  data.year = time.getFullYear();

  // get user path
  var cwd = process.cwd();

  // owner

  /**
   * get arguments
   * first is name
   * second is extra option
   */

  var currentName = data.name;

  // get current dirname
  var dir = path.dirname(__dirname);

  // get template
  var template = path.join(dir, 'template');

  // get current path
  var currentPath = path.join(cwd, currentName);

  // exec
  if (currentName) {
    // detect path
    if (dirutil.exists(currentPath)) {
      console.error('Error : this project maybe existed,please checkout it.');
      process.exit();
    }

    var shell = exec('cp -rf ' + template + ' ' + currentPath, function(error) {
      if (error) {
        throw error;
      }
      dirutil.traversal(currentPath, function(error, result) {
        if (error) {
          throw error;
        }
        result.forEach(function(i) {
          var basename = path.basename(i);
          var dirname = path.dirname(i);
          var tpl = fs.readFileSync(i, 'utf8');
          var content = render(tpl, data);
          basename = render(basename, data);

          if (basename === 'gitignore' ||
              basename === 'eslintignore' ||
              basename === 'eslintrc.js' ||
              basename === 'travis.yml') {
            basename = '.' + basename;
          }

          var p = path.join(dirname, basename);
          fs.writeFileSync(p, content);

          if (i !== p) {
            fs.unlinkSync(i);
          }
        });
      });
    });

    shell.on('exit', function() {
      console.log('genetate success!\n');
      console.log('your project\'s path : ' + currentPath);
    });
  } else {
    console.error('Error : input your project\'s name.');
    process.exit();
  }
};
