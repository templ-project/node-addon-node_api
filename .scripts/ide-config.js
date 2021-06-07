const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

function runConfigure(tool, callback) {
  console.log(`Running '${tool}' configuration...`);
  const npx = spawn(path.join(`.`, `node_modules`, '.bin', process.platform !== 'win32' ? tool : `${tool}.cmd`), [
    'configure',
  ]);
  let config = '';

  npx.stdout.on('data', (data) => {
    config = `${config}${data}`;
  });

  npx.stderr.on('data', (data) => {
    config = `${config}${data}`;
  });

  npx.on('close', (code) => {
    if (code !== 0) {
      console.error(config);
      process.exit(code);
    }
    console.log('Done.');
    callback();
  });
}

function parseCMakeJsSettingsAndConfigureIde(callback) {
  console.log('Reading configuration...');

  let includes = [];

  // if (process.platform !== 'win32') {
  const cMakeCachePath = path.join(__dirname, '..', 'build', 'CMakeFiles', 'main.dir', 'flags.make');
  const matches = fs
    .readFileSync(cMakeCachePath)
    .toString()
    .match(/CXX_INCLUDES = .+/gi);

  if (Array.isArray(matches) && matches.length > 0) {
    includes = matches[0]
      .split(' = ')[1]
      .split(' ')
      .filter((s) => s)
      .map((s) => s.substr(2));
  } else {
    console.error('Could not read CMakeCache.txt. No included discovered');
    process.exit(1);
  }
  // } else {
  //   // TODO:
  // }

  console.log('Done.');

  callback(includes);
}

function parseNodeGypSettingsAndConfigureIde(callback) {
  console.log('Reading configuration...');
  let includes = [];
  if (process.platform !== 'win32') {
    includes = parseMainTargetMk();
  } else {
    includes = parseMainVcxproj();
  }
  console.log('Done.');

  callback(includes);
}

function parseMainTargetMk() {
  const incsRelease = fs
    .readFileSync(path.join(__dirname, '..', 'build', 'main.target.mk'))
    .toString()
    .match(/INCS_Release := \\\n(\s+\-I[^\n]+\n)+/g);

  if (!Array.isArray(incsRelease) || incsRelease.length === 0) {
    console.error('Could not determine include list');
    process.exit(1);
  }

  const localSrc = path.join(__dirname, '..', 'src');

  return incsRelease[0]
    .split('\n')
    .slice(1)
    .map((c) =>
      c
        .trim()
        .replace(/^\-I/gi, '')
        .replace(/\s+\\$/, '')
        .replace('$(srcdir)', path.join(__dirname, '..')),
    )
    .filter((c) => c)
    .filter((c) => c != localSrc)
    .filter((c) => {
      try {
        return fs.statSync(c).isDirectory();
      } catch (e) {
        return null;
      }
    });
}

function parseMainVcxproj() {
  return fs
    .readFileSync(path.join(__dirname, '..', 'build', 'main.vcxproj'))
    .toString()
    .split('\n')
    .filter((l) => l.includes('AdditionalIncludeDirectories'))
    .map((l) =>
      l
        .replace(/<\/?AdditionalIncludeDirectories>/gi, '')
        .replace(/;%\(AdditionalIncludeDirectories\)/gi, '')
        .trim()
        .split(';'),
    )
    .reduce((a, b) => [...new Set([...a, ...b])], [])
    .map((l) => (path.isAbsolute(l) ? l : path.join(__dirname, l)))
    .map((l) => l.replace(/\\/gi, '/'));
}

function writeCMakeListsTxt(includes) {
  console.log('Configuring CMakeLists.txt ...');

  const cMakeListsTxtPath = path.join(__dirname, '..', 'CMakeLists.txt');
  const cMakeListsTxt = fs.readFileSync(`${cMakeListsTxtPath}.template`).toString();

  const cmakeLines = includes.map((item) => `  include_directories(${item})`);

  fs.writeFileSync(
    cMakeListsTxtPath,
    cMakeListsTxt.replace(
      /\s+# start clion-config here\n(.+\n)*\s+# end clion-config here/gi,
      `\n  # start clion-config here
${cmakeLines.join('\n')}
  # end clion-config here`,
    ),
  );

  console.log('Done.');
}

module.exports = {
  parseCMakeJsSettingsAndConfigureIde,
  parseNodeGypSettingsAndConfigureIde,
  runConfigure,
  writeCMakeListsTxt,
};
