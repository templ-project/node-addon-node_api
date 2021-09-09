const fs = require('fs');
const path = require('path');

const bp = require('./utils-back-path');
const nodeLibLocationCmake = require('./cmake-js-lib-location');
const nodeLibLocationGyp = require('./node-gyp-lib-lication');
const packageJsonContainsNan = require('./package-json-contains-nan');
const packageJsonContainsNapi = require('./package-json-contains-napi');
const pathIsValid = require('./utils-path-is-valid');
const supportedBuildSystems = require('./supported-build-systems');
const supportedIdes = require('./supported-ides');

/**
 * Will calculate list of libraries that need included in the C++ config files.
 *
 * Modify at your own risk.
 *
 * @param {object} options
 */
module.exports = (options) => {
  let folders = ['', 'openssl']
    .map((item) => [item, path.join(nodeLibLocationGyp[process.platform], item)])
    .reduce((acc, item) => [].concat(acc, item), [])
    .filter(pathIsValid);

  if (options.buildSystem === supportedBuildSystems.CMAKE || options.ide === supportedIdes.CLION) {
    folders = ['', 'openssl']
      .map((item) => [item, path.join(nodeLibLocationCmake[process.platform], item)])
      .reduce((acc, item) => [].concat(acc, item), [])
      .filter(pathIsValid);
  }

  // will be dependent on node-gyp files
  // if (options.buildSystem === supportedBuildSystems.XMAKE) {}

  if (packageJsonContainsNan()) {
    folders.push(path.join(__dirname, ...bp(3), 'node_modules', 'nan'));
  }

  if (packageJsonContainsNapi()) {
    folders.push(path.join(__dirname, ...bp(3), 'node_modules', 'node-addon-api'));
  }

  // will be dependent on node-gyp files
  if (options.buildSystem === supportedBuildSystems.XMAKE) {
    folders = folders.map((item) => item.replace(/\\/g, '/'));
  }

  return folders;
};
