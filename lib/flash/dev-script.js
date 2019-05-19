const fs = require('fs');

const mkdir = function (dir) {
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir);
};

//copy the $file to $dir2
const cpfile = function (file, dir2) {
  //include the fs, path modules
  const path = require('path');

  //gets file name and adds it to dir2
  const f = path.basename(file);
  const source = fs.createReadStream(file);
  const dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  source.on('end', function () { console.log('Succesfully copied', file); });
  source.on('error', function (err) { console.log(err); });
};

mkdir('./dist');
mkdir('./dist/livecard-sdk/');

const dest = './dist/livecard-sdk/flash/';

mkdir(dest);

cpfile(__dirname + '/expressInstall.swf', dest);
cpfile(__dirname + '/LCCapture.swf', dest);
cpfile(__dirname + '/swfobject.js', dest);