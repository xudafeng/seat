//import modules
var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');
var dirutil = require('dirutil');

//global data

var data = {};
//get time
var time = data.time = new Date();
data.year = time.getFullYear();

//get user path
var cwd = process.cwd();

/**
 * get arguments
 * first is name
 * second is extra option
 */
var args = process.argv.slice(2);
var name = data.name = args[0];

//get current dirname
var dir = path.dirname(__dirname);

//get template
var template = path.join(dir,'template');

//get current path
var currentPath = path.join(cwd,name);

//simple render
function render(template,data){
  var tagOpen = '<#';
  var tagClose = '#>';
  var content = '';
  template.split(tagOpen).forEach(function(i){
    i = i.split(tagClose);
    var $0 = i[0],
      $1 = i[1];
    if (i.length == 1) {
      content += $0;
    } else {
      content += data[$0] || '';
      if ($1) {
        content += $1;
      }
    }
  });
  return content;
}

//exec
if (name) {

  //detect path
  if (dirutil.exists(currentPath)){
    console.error('Error : this project maybe existed,please checkout it.')
    process.exit();
  }

  var shell = exec('cp -rf ' + template + ' ' + currentPath, function (error) {
    if(error){
      throw error;
    }
    dirutil.traversal(currentPath,function(error, result){
      if (error){
        throw error;
      }
      result.forEach(function(i){
        var basename = path.basename(i);
        var dirname = path.dirname(i);
        var tpl = fs.readFileSync(i, 'utf8');
        var content = render(tpl, data);
        basename = render(basename, data);
        var p = path.join(dirname, basename);
        fs.writeFileSync(p, content);
        if(i !== p){
          fs.unlinkSync(i);
        }
      });
    });
  });

  shell.on('exit', function () {
      console.log('genetate success!\n');
      console.log('your project\'s path : '+currentPath);
  });
}else{
  console.error('Error : input your project\'s name.');
  process.exit();
}
