const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  getCommandPath,
  parseCMakeFilesMainDirFlagsMake,
  parseMainTargetMk,
  parseMainVcxproj,
  pspawn,
} = require('./ide-config');
const globby = require('globby');
const colors = require('colors');

const debug = process.env.DEBUG ? true : false;

async function main() {
  const clangFormat = await getCommandPath('clang-format');
  if (!clangFormat) {
    // TODO: Add proper error
    console.error('Could not find clang-format.');
    process.exit(1);
  }

  const commands = await globby(process.argv[2]).then((files) =>
    files
      .filter((f) => f)
      .map((file) => ({
        file,
        command: [
          clangFormat.trim(),
          ...process.argv.slice(3),
          path.isAbsolute(file) ? file : path.join(__dirname, '..', file),
          '--',
          ...(process.env.CLANG_ARGS ? process.env.CLANG_ARGS.split(' ') : []),
        ],
      })),
  );

  for (const command of commands) {
    if (debug) {
      console.log(command.command.join(' '));
    }
    const prePrettier = fs.readFileSync(command.file).toString();
    const {stdout, stderr, code} = await pspawn(command.command);
    const postPrettier = fs.readFileSync(command.file).toString();
    if (command.command.includes('-i')) {
      if (code !== 0) {
        console.log(stdout + stderr);
        process.exit(code);
      } else {
        if (prePrettier === postPrettier) {
          console.log(`${command.file}`.gray);
        } else {
          console.log(`${command.file}`);
        }
      }
    } else {
      console.log(`${command.file}`.gray);
      console.log(stdout + stderr);
      if (code !== 0) {
        process.exit(code);
      }
    }
  }
}

main();
