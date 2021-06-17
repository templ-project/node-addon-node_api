const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');

const cExtensions = ['c', 'cc', 'cpp', 'h', ...(process.env.CPP_EXTENSIONS || [])];

function folderExists(c) {
  // console.log(c);
  try {
    return fs.statSync(c).isDirectory();
  } catch (e) {
    return null;
  }
}

/**
 *
 * @param {string} command
 * @param {number} timeout
 * @returns {Promise<{stdout: string, stderr: string, code: number}>}
 */
async function pspawn(command, timeout = 20000) {
  if (!Array.isArray(command) || command.length < 1) {
    throw new Error('Invalid command');
  }
  return new Promise((resolve, reject) => {
    const runner = spawn(command[0], command.slice(1));
    let stdout = '';
    let stderr = '';

    const t = setTimeout(() => reject('Running command exceeded timeout'), timeout);

    runner.stdout.on('data', (data) => {
      stdout = `${stdout}${data}`;
    });

    runner.stderr.on('data', (data) => {
      stderr = `${stderr}${data}`;
    });

    runner.on('close', (code) => {
      clearTimeout(t);
      resolve({stdout, stderr, code});
    });
  });
}

function runConfigure(tool, callback) {
  console.log(`Running '${tool}' configuration...`);
  const command = [
    path.join(`.`, `node_modules`, '.bin', process.platform !== 'win32' ? tool : `${tool}.cmd`),
    'configure',
    // https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html
    ...(tool === 'cmake-js' && process.env.NODE_CMAKE_GENERATOR ? ['-G', process.env.NODE_CMAKE_GENERATOR] : []),
  ];
  console.log('Running', command);
  const npx = spawn(command[0], command.slice(1));
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

  if (process.platform !== 'win32') {
    includes = parseCMakeFilesMainDirFlagsMake();
  } else {
    includes = parseMainVcxproj();
  }

  console.log('Done.');

  callback(includes.filter(folderExists).map((l) => l.replace(/\\/gi, '/')));
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

  callback(includes.filter(folderExists).map((l) => l.replace(/\\/gi, '/')));
}

/**
 * Parses cmake-js build project
 * @returns {string[]}
 */
function parseCMakeFilesMainDirFlagsMake() {
  let matches = [];

  const cMakeCachePath = path.join(__dirname, '..', 'build', 'CMakeFiles', 'main.dir', 'flags.make');

  matches = fs
    .readFileSync(cMakeCachePath)
    .toString()
    .match(/CXX_INCLUDES = .+/gi);

  return matches[0]
    .split(' = ')[1]
    .split(' ')
    .filter((s) => s)
    .map((s) => s.substr(2))
    .filter(folderExists);
}

/**
 * Parses node-gyp gcc (make) project
 *
 * @returns {string[]}
 */
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
    .filter(folderExists);
}

/**
 * Parses Visual Studio project
 *
 * @returns {string[]}
 */
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
    .filter(folderExists);
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

async function getCommandPath(command) {
  if (process.platform !== 'win32') {
    const {stdout, code} = await pspawn(['which', command]);
    if (!stdout || code !== 0) {
      return '';
    }
    return stdout;
  }
  const {stdout, code} = await pspawn([
    ...'powershell -ExecutionPolicy ByPass -Command'.split(' '),
    `(Get-Command ${command}).Source`,
  ]);
  if (!stdout || code !== 0) {
    return '';
  }
  return stdout;
}

module.exports = {
  cExtensions,
  getCommandPath,
  parseCMakeFilesMainDirFlagsMake,
  parseCMakeJsSettingsAndConfigureIde,
  parseMainTargetMk,
  parseMainVcxproj,
  parseNodeGypSettingsAndConfigureIde,
  pspawn,
  runConfigure,
  writeCMakeListsTxt,
};
