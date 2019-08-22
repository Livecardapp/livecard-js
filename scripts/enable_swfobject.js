const fs = require('fs');

const encoding = 'utf-8';
const fpath = './dist/dev.html';
console.log(`Watching for file changes on ${fpath}`);

// fs.unlinkSync(fpath)
fs.watchFile(fpath, (curr, prev) => {
  const t = fs.readFileSync(fpath, encoding);
  const tag = '<script src="/livecard-sdk/flash/swfobject.js"></script>';
  const output = t.replace(`<!-- ${tag} -->`, tag);
  fs.unlinkSync(fpath)
  fs.writeFileSync(fpath, output, encoding);
  console.log(`Updated ${fpath} to enable swfobject.js`);
  process.exit(0);
});

