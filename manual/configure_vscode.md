## Configuring Visual Studio Code for developing a NodeJs C++ Addon 

Visual Studio Code is gifted with two plugins for C/C++ support:
  - Microsoft C/C++ [ms-vscode.cpptools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) with good support for language support, debugging and intellisense, yet no formatting options and
  - LLVM Clangd [llvm-vs-code-extensions.vscode-clangd](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) with pretty much everything that Microsoft does but better + adding formatting options.

The following set of instructions will generate configuration for both extensions.

1. Run `node .scripts/vscode-config.js`. 
  This will generate configurations for both *Microsoft C/C++* and *LLVM Clangd*
2. In order to make *LLVM Clangd* fully work, you will also need to set the `clangd.path` argument in your configuration. If you have clangd tool already installed on your machine, you can set the path to that specific installation; if not, the extension will ask you to download its own clangd binary. We suggest second version, since you will benefit of the latest release of *clangd*.


### .vscode/c_cpp_properties.json.template

> Used to generate `.vscode/c_cpp_properties.json`.
> Do not modify the `.json` file as it is ignored by git. Always alter the `.json.template` one, and then run the `vscode-config.js` script.

For a better understanding of this file, please read [https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference](https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference)


### .vscode/launch.json

For a better understanding of this file, please read [Debugging](https://code.visualstudio.com/docs/editor/debugging) section in the Visual Studio Code documentation.

This file is not altered by any configuration script, is it only presented as sample for you to configure for your own purposes.

### .vscode/settings.json

> Used to generate `.vscode/settings.json`.
> Do not modify the `.json` file as it is ignored by git. Always alter the `.json.template` one, and then run the `vscode-config.js` script.

This file helps you overwrite certain settings related to the two C/C++ extensions mentioned above. The configuration will be done automatically based on the options that you provide to the configuration script as well as on the configurations that are detected by the `node-gyp` library.

### compile_flags.txt.template

> Used to generate `compile_flags.txt`.
> Do not modify the `.txt` file as it is ignored by git. Always alter the `.txt.template` one, and then run the `vscode-config.js` script.

This file is configured and generated for the soul purpose of making *Clangd* aware of any external libraries that your addon will use. 

The file is altered by the `vscode-config.js` in order to add external node libraries. If yoy wish to add other libraries / headers, please do as explained bellow.

```
-Wall
# start clangd-config here
-I
/home/dragosc/.cache/node-gyp/12.20.2/include/node
-I
/home/dragosc/Workspace/templates/node-addon-nan/node_modules/nan
# end clangd-config here
# add any other libraries here
```
