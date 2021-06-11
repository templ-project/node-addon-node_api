## Configuring CLion for developing a NodeJs C++ Addon 

<!-- TOC -->

- [Configuring CLion for developing a NodeJs C++ Addon](#configuring-clion-for-developing-a-nodejs-c-addon)
  - [CMake](#cmake)
  - [Configuring the project in CLion](#configuring-the-project-in-clion)
    - [Open Project Wizard](#open-project-wizard)
      - [Windows](#windows)
    - [Run/Debug Configuration](#rundebug-configuration)

<!-- /TOC -->

> CLion is a very gifted C/C++ IDE. However we could not make clion work with `node-gyp`. Instead, when using CLion, please use `node .scripts/clion-config.js --use-cmake-js` for now.
> 
> You can still use `node-gyp` to build the project, but CLion needs to be configured using `cmake-js`. We hope to fix this soon.
> 
> By default, CLion is configured to use CMake

### CMake

For this, a default [CMakeLists.tst](../CMakeLists.tst) file has been added to the project. File that can be adapted to the node version you want to develop for, by running `node .scripts/clion-config.js`.

> The adaptation of the `CMakeLists.tst`, done with the `clion-config.js` is strictly for enabling CLion to read dependent node libraries.
> Otherwise:
> * `node-gyp` is completly independent of the CMakeLists.txt file
> * `cmake-js` is configured to ignore the definitions added and may need additional configuration for other external libraries


```powershell
# add any other dependencies before or after this if

if (CMAKE_JS_VERSION)
else()
  # start clion-config here
  # leave this section unaltered; it will be changed by the `clion-config.js` script
  include_directories(/home/dragosc/.cache/node-gyp/12.20.2/include/node)
  include_directories(/home/dragosc/Workspace/templates/node-addon-nan/node_modules/nan)
  # end clion-config here
endif()

# add any other dependencies before or after this if
```


### Configuring the project in CLion

#### Open Project Wizard

When opening the project, during the **Open Project Wizzard** process, please set the `Build directory` to `build` as shown in the image bellow.

This will enable nodejs to properly read the compiled libraries.

<img src="manual/../open_project_wizard.png">

##### Windows

For Windows, CLion uses as generator for CMake `CodeBlocks - NMake Makefiles` by default which is not the one `cmake-js` will choose.

In my case `cmake-js` chose `Visual Studio 16 2019` as generator, so you will also need to set the CMake generator, by adding something like `-G "Visual Studio 16 2019"` in the `CMake Options` field.

<img src="manual/../open_project_wizard_windows.png">

#### Run/Debug Configuration

After opening the project, please amend the **Run/Debug Configuration** as follows:

1. `Executable` must be the path to *node* binary. Please make sure you're setting the correct and proper node binary path. If you're using *nvm* please make sure you're setting the path to the proper version of node, otherwise you will encounter version errors.
2. For the `Program arguments` you can use either a path to 
   * the `main` file as set in the `package.json` or 
   * the path to `mocha` or `jest` binaries in order to run & debug tests
3. For the `Working directory` I recommend using the path to the project folder, since that's the place for any possible data or libaries that you will require during the run/debug sessions.

<img src="manual/../run_debug_configuration.png">
