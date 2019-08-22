const fs = require('fs');

const encoding = 'utf-8';
const fpath = './dist/dev.html';
const t = fs.readFileSync(fpath, encoding);
const tag = '<script src="/livecard-sdk/flash/swfobject.js"></script>';
const output = t.replace(`<!-- ${tag} -->`, tag);

fs.unlinkSync(fpath)
fs.writeFileSync(fpath, output, encoding);
