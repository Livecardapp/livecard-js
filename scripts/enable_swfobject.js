const fs = require('fs');

const encoding = 'utf-8';
const fpath = './dist/dev.html';
console.log(`Watching for file changes on ${fpath}`);

if (fs.existsSync(fpath))
  fs.unlinkSync(fpath);

fs.closeSync(fs.openSync(fpath, 'w'));

fs.watchFile(fpath, (curr, prev) => {
  const t = fs.readFileSync(fpath, encoding);
  const tag = '<script src="/livecard-sdk/flash/swfobject.js"></script>';
  const output = t.replace(`<!-- ${tag} -->`, tag);
  fs.unlinkSync(fpath)
  fs.writeFileSync(fpath, output, encoding);
  console.log(`Updated ${fpath} to enable swfobject.js\n`);
  console.log(`Server started at http://localhost:1234/`);
  process.exit(0);
});

