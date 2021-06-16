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
  // const includes = [parseMainVcxproj, parseMainTargetMk, parseCMakeFilesMainDirFlagsMake]
  //   .reduce(
  //     (acc, method) => {
  //       if (!acc.done) {
  //         try {
  //           acc.includes = [...acc.includes, ...method()];
  //           acc.done = true;
  //         } catch (e) {
  //           console.warn(e.message);
  //         }
  //       }
  //       return acc;
  //     },
  //     {includes: [], done: false},
  //   )
  //   .includes.map((include) => `-I${include}`);

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

// #! /bin/bash
// [ -z $DEBUG ] && [ "$DEBUG" != "" ] && set -xe

// which clang-format > /dev/null && CLANG=$(which clang-format)
// which clang-format > /dev/null || CLANG=".scripts/clang/bin/clang-format"

// CLANG_ARGS="--verbose -style=file"

// FILTER="-iname *.c"

// if [ ! -f "$CLANG" ]; then
//   echo "Clang not found. Downloading..."

//   ./.scripts/clang-install

//   echo
//   echo "Done."
// fi

// for ext in cc cpp h; do FILTER="$FILTER -or -iname *.$ext"; done

// echo "$@" | grep "\-i" > /dev/null && find ./src $FILTER | while read f; do
//   cp $f /tmp/clang-format.tmp
//   $CLANG $CLANG_ARGS $@ $f 2>&1 | sed '1d' > /dev/null

//   diff /tmp/clang-format.tmp $f 2>&1 > /dev/null
//   if [ $? -eq 0 ]; then
//     echo -e "\e[2m$f\e[0m"
//   else
//     echo $f
//   fi
// done

// echo "$@" | grep "\-i" > /dev/null || find ./src $FILTER | while read f; do
//   echo -e "\e[2m$f\e[0m"

//   $CLANG $CLANG_ARGS $@ $f 2>&1 | sed '1d'
// done
