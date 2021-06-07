const fs = require('fs');
const path = require('path');

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(`node vscode-config.js
  Arguments:
  --use-clangd will configure VSCode based on the Clangd extension (default is Microsoft C/C++)
  --use-cmake-js will configure VSCode based on cmake-js (default is node-gyp)
`);
  process.exit(0);
}

if (process.argv.includes('--use-cmake-js')) {
  let cMakeListsTxtExists = false;
  try {
    cMakeListsTxtExists = fs.statSync(path.join(__dirname, '..', 'CMakeLists.txt')).isFile();
  } catch (e) {}

  if (!cMakeListsTxtExists) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'CMakeLists.txt.template'),
      path.join(__dirname, '..', 'CMakeLists.txt'),
    );
  }
}

const {
  parseCMakeJsSettingsAndConfigureIde,
  parseNodeGypSettingsAndConfigureIde,
  runConfigure,
  writeCMakeListsTxt,
} = require('./ide-config');

if (process.argv.includes('--use-cmake-js')) {
  runConfigure('cmake-js', () => parseCMakeJsSettingsAndConfigureIde(writeVSCodeConfig));
} else {
  runConfigure('node-gyp', () => parseNodeGypSettingsAndConfigureIde(writeVSCodeConfig));
}

function writeVSCodeConfig(includes) {
  writeCCppProperties(includes);
  writeCompileFlagsTxt(includes);
  writeCMakeListsTxt(includes);
  changeVsCodeSettings();
}

function writeCCppProperties(includes) {
  console.log('Configuring `ms-vscode.cpptools` extension...');
  const cppConfigPath = './.vscode/c_cpp_properties.json';
  const cppConfig = JSON.parse(fs.readFileSync(`${cppConfigPath}.template`).toString());
  cppConfig.configurations = cppConfig.configurations.map((itemConfig) => ({
    ...itemConfig,
    includePath: includes,
  }));
  fs.writeFileSync(cppConfigPath, JSON.stringify(cppConfig, null, 2));
  console.log('Done.');
}

function writeCompileFlagsTxt(includes) {
  console.log('Configuring `llvm-vs-code-extensions.vscode-clangd` extension...');
  const compileFlagsTxtPath = path.join(__dirname, '..', 'compile_flags.txt');
  const compileFlagsTxt = fs.readFileSync(`${compileFlagsTxtPath}.template`).toString();
  let lines = [];
  includes.forEach((c) => (lines = [...lines, '-I', c]));

  fs.writeFileSync(
    compileFlagsTxtPath,
    compileFlagsTxt.replace(
      /# start clangd-config here\n(.+\n)*# end clangd-config here/gi,
      `# start clangd-config here
${lines.join('\n')}
# end clangd-config here`,
    ),
  );
  console.log('Done.');
}

function changeVsCodeSettings() {
  console.log('Configuring .vscode/settings.json');
  const vscodeConfigPath = path.join(__dirname, '..', '.vscode', 'settings.json');
  const vscodeConfig = JSON.parse(fs.readFileSync(`${vscodeConfigPath}.template`).toString());

  vscodeConfig['[cpp]'] = {
    ...vscodeConfig['[cpp]'],
    'editor.defaultFormatter': 'llvm-vs-code-extensions.vscode-clangd',
  };

  if (process.argv.includes('--use-clangd')) {
    console.log(`It seems you want to use clang for intellisense. Disabling C++ InstelliSenseEngine`);
    vscodeConfig['C_Cpp.intelliSenseEngine'] = 'Disabled';
  } else {
    console.log(
      `It seems you want to use Microsoft C++ module. To use 'clangd', please add --use-clangd flag to the command.`,
    );
    console.log(
      `If you wish to continue with the Microsoft C++ module, you should disable 'llvm-vs-code-extensions.vscode-clangd' module, in order to run things smoothly.`,
    );
    vscodeConfig['C_Cpp.intelliSenseEngine'] = 'Default';
    vscodeConfig['[cpp]'] = {
      ...vscodeConfig['[cpp]'],
      'editor.defaultFormatter': '',
    };
    delete vscodeConfig['[cpp]']['editor.defaultFormatter'];
  }

  fs.writeFileSync(vscodeConfigPath, JSON.stringify(vscodeConfig, null, 2));

  console.log('Done.');
}
