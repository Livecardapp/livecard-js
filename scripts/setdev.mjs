import fs from 'fs';
import path from 'path';

// ------- //
// PRIVATE //
// ------- //

const mkdir = (dir) => {
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir);
};

const cpfile = (file, dest) => {
  const f = path.basename(file);
  const source = fs.createReadStream(file);
  const destStream = fs.createWriteStream(path.resolve(dest, f));
  source.pipe(destStream);
  source.on('end', () => { console.log('Succesfully copied', file); });
  source.on('error', (err) => { console.log(err); });
};

const cpfiles = (src, dest) => {
  fs.readdir(src, (err, files) => {
    files.forEach(file => { cpfile(path.join(src, file), dest); });
  });
};

// ---- //
// MAIN //
// ---- //

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const staticDest = './dist/livecard-sdk/';

mkdir('./dist');
mkdir(staticDest);

// Flash

const flashSrc = path.join(__dirname, '..', 'static/flash');
const flashDest = `${staticDest}flash/`;

mkdir(flashDest);
cpfiles(flashSrc, flashDest);

// Images

const imageSrc = path.join(__dirname, '..', 'static/images');
const imageDest = `${staticDest}images/`;

mkdir(imageDest);
cpfiles(imageSrc, imageDest);