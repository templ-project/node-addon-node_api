const fs = require('fs');
const path = require('path');

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(`node clion-config.js
  Arguments:
  --use-cmake-js will configure VSCode based on cmake-js (default is node-gyp)`);
  process.exit(0);
}

const {
  parseCMakeJsSettingsAndConfigureIde,
  parseNodeGypSettingsAndConfigureIde,
  runConfigure,
  writeCMakeListsTxt,
} = require('./ide-config');

if (process.argv.includes('--use-cmake-js')) {
  runConfigure('cmake-js', () => parseCMakeJsSettingsAndConfigureIde(writeCMakeListsTxt));
} else {
  runConfigure('node-gyp', () => parseNodeGypSettingsAndConfigureIde(writeCMakeListsTxt));
}
