const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

rimraf.sync(`${__dirname}/../node_modules/.bin/clang-lint*`);
rimraf.sync(`${__dirname}/../node_modules/.bin/clang-prettier*`);

[
  'clang-prettier',
  'clang-prettier.cmd',
  'clang-prettier.ps1',
  'clang-lint',
  'clang-lint.cmd',
  'clang-lint.ps1',
].forEach((f) => {
  const l = path.join(__dirname, '..', 'node_modules', '.bin', f);
  try {
    fs.unlinkSync(l);
  } catch (e) {}
  if (process.platform !== 'win32') {
    fs.symlinkSync(path.join(__dirname, f), l);
  } else {
    fs.copyFileSync(path.join(__dirname, f), l);
  }
});
