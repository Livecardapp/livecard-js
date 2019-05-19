
//copy the $file to $dir2
const copyFile = function (file, dir2) {
  //include the fs, path modules
  const fs = require('fs');
  const path = require('path');

  //gets file name and adds it to dir2
  const f = path.basename(file);
  const source = fs.createReadStream(file);
  const dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  source.on('end', function () { console.log('Succesfully copied', file); });
  source.on('error', function (err) { console.log(err); });
};

const dest = './dist/livecard-sdk/flash/';

copyFile(__dirname + '/expressInstall.swf', dest);
copyFile(__dirname + '/LCCapture.swf', dest);
copyFile(__dirname + '/swfobject.js', dest);