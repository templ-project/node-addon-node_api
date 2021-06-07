# Templ Node.js Addon Node Api

<!-- https://hits.seeyoufarm.com/ -->
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Ftempl-project%2Fnode&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/templ-project/node-addon-node_api/issues)

![JSCPD](.jscpd/jscpd-badge.svg?raw=true)

<!-- [![TravisCI](https://travis-ci.org/templ-project/node-addon-node_api.svg?branch=master)](https://travis-ci.org/templ-project/node-addon-node_api) -->
<!-- CI Badges -->
<!-- [![CircleCI](https://circleci.com/gh/templ-project/node-addon-node_api.svg?style=shield)](https://circleci.com/gh/templ-project/node-addon-node_api) -->

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=alert_status)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=code_smells)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=security_rating)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=ncloc)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=templ-project_node-addon-node_api)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=templ-project_node-addon-node_api)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=sqale_index)](https://sonarcloud.io/dashboard?id=templ-project_node-addon-node_api)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=templ-project_node-addon-node_api&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=templ-project_node-addon-node_api)

<!-- Donation Badges -->
[![Donate to this project using Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://patreon.com/dragoscirjan)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QBP6DEBJDEMV2&source=url)
<!--
[![Donate to this project using Flattr](https://img.shields.io/badge/flattr-donate-yellow.svg)](https://flattr.com/profile/balupton)
[![Donate to this project using Liberapay](https://img.shields.io/badge/liberapay-donate-yellow.svg)](https://liberapay.com/dragoscirjan)
[![Donate to this project using Thanks App](https://img.shields.io/badge/thanksapp-donate-yellow.svg)](https://givethanks.app/donate/npm/badges)
[![Donate to this project using Boost Lab](https://img.shields.io/badge/boostlab-donate-yellow.svg)](https://boost-lab.app/dragoscirjan/badges)
[![Donate to this project using Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg)](https://buymeacoffee.com/balupton)
[![Donate to this project using Open Collective](https://img.shields.io/badge/open%20collective-donate-yellow.svg)](https://opencollective.com/dragoscirjan)
[![Donate to this project using Cryptocurrency](https://img.shields.io/badge/crypto-donate-yellow.svg)](https://dragoscirjan.me/crypto)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://dragoscirjan.me/paypal)
[![Buy an item on our wishlist for us](https://img.shields.io/badge/wishlist-donate-yellow.svg)](https://dragoscirjan.me/wishlist)
-->

<img alt="JavaScript Logo" src="https://github.com/templ-project/node-addon-node_api/blob/master/javascript.svg?raw=true" width="20%" align="right" />

<!-- Project Description Starts Here -->


> *Any fool can write code that a computer can understand. Good programmers write code that humans can understand.* – Martin Fowler

> **node-addon-node_api** is a template project, designed by [Templ Project](http://templ-project.github.io). Please download it and adapt it as you see fit.
>
> **node-addon-node_api** includes instructions for initializing a new
> **NodeJs Addon Node Api** addon project, and configuring it for development, unit
> testing as well as code linting and analysis.
> 
> **node-addon-nam** can be configured to use:
> * **[node-gyp](https://www.npmjs.com/package/node-gyp)** default and official builder 
> * **[cmake-js](https://www.npmjs.com/package/cmake-js)** builder based on [CMake](https://cmake.org/) 
<!-- > * **[xmake](https://www.npmjs.com/package/xmake)** builder based on [xmake](https://xmake.io/)  -->
>
> **javascript** part implements:
> - [jscpd](https://github.com/kucherenko/jscpd), [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for code analisys
> - [prettier](https://prettier.io/) for code formatting
> - [eslint](https://eslint.org/) for linting
>
> **c++** part implements:
> - [llmv clang](https://clang.llvm.org/) for linting and formatting
>
> By default, this implementation uses [npm](https://www.npmjs.com/), but you can easily change it to [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.js.org/) or any other package manager. 

<!-- TOC -->

- [Templ Node.js Addon Node Api](#templ-nodejs-addon-node-api)
  - [Getting Started](#getting-started)
    - [Prerequisites / Dependencies](#prerequisites--dependencies)
        - [TODO: For MacOS](#todo-for-macos)

<!-- /TOC -->

## Getting Started

### Prerequisites / Dependencies

##### TODO: For MacOS

- Please install `git`, `c++`, `make`, `cmake` <!--or ~~`xmake`~~-->
- Please install Python 3.6 or above.

```bash
brew install git make
# for CMake
brew install  cmake
```
<!-- # for xmake
bash <(curl -fsSL https://xmake.io/shget.text)
``` -->
##### For Linux

- Please install `git`, `c++`, `make`, `cmake` <!--or ~~`xmake`~~-->
- Please install Python 3.6 or above.

```bash
# i.e ubuntu
sudo apt-get install build-essential git make -y
# for CMake
sudo apt-get install  cmake
```
<!-- # for xmake
bash <(curl -fsSL https://xmake.io/shget.text)
``` -->
##### For Windows

- Please install [git-scm](https://git-scm.com/download/win) tool.
- Please install a form of make
  - Install [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm)
  - Install [make](https://sourceforge.net/projects/ezwinports/files/) from [ezwinports](https://sourceforge.net/projects/ezwinports/files/)
  - Install [chocolatey](https://chocolatey.org/), run `choco install make`
- Please install [Python](https://www.python.org/downloads/windows/) & [Microsoft Build Tools 2017](https://visualstudio.microsoft.com/):
  - Run `npm i -g windows-build-tools`

###### For cmake
- Please install [cmake](https://cmake.org/)

<!-- ###### ~~For xmake~~
- Please install [xmake](https://xmake.io/)
```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/psget.text' -UseBasicParsing).Content
``` -->
#### Known Issues / Troubleshooting

1. Note that `node-gyp` doesn't support Python 2.7 anymore, so you'll need to install Python 3.6 or above.
2. If you plan on using [CLion](https://www.jetbrains.com/clion/) we recommend switching to `cmake-js`, since CLion has not support for `gyp`.

### Installation

```bash
git clone https://github.com/templ-project/node-addon-node_api your_project
cd your_project
rm -rf .git
git init
git add remote origin https://url/to/your/project/repository
git add .
git commit -am "init"
git push origin master
npm run change:language -- javascript # to use javascript
# or
# npm run change:language -- typescript # to use typescript
npm install
# yarn install
# pnpm install
```

### Development

#### Requirements

Please install:
- [NodeJs](https://nodejs.org/en/). We support version 12.x and above.
- a C++ IDE
  - [Visual Studio Code](https://code.visualstudio.com/) with [ITMCDev C++ Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-cpp-extension-pack)
    - For Linux:
      - [gdb](https://www.gnu.org/software/gdb/) if you plan in using **gdb** as debug tool,
      - if not, [vadimcn.vscode-lldb](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) will help you without any flaws
  - [Jetbrains CLion](https://www.jetbrains.com/clion/)
  - Please help us supporting other IDEs as well
- a JavaScript/TypeScript IDE
  - [Visual Studio Code](https://code.visualstudio.com/) with [ITMCDev Node Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-extension-pack)
  - [Jetbrains WebStorm](https://www.jetbrains.com/webstorm/)
  - Please help us supporting other IDEs as well

##### VSCode Configuration

Please read about configuring [Visual Studio Code](manual/configure_vscode.md).

##### CLion Configuration

Please read about configuring [Jetbrains CLion](manual/configure_clion.md).

### Testing

Run unit tests using `npm run test`.

Testing is currently set to use unittest.

#### Single Tests

Run single unit tests file, by calling `npm run test:single -- test/path/to/file.test.js`

```bash
npm test:single -- test/index.test.js
```

### Deployment

Please check [release-it](https://www.npmjs.com/package/release-it) for making releases to [npmjs.com](https://www.npmjs.com/) or any other repository tool, then run:

```bash
npm run release
```

## Authors

* [Dragos Cirjan](mailto:dragos.cirjan@gmail.com) - Initial work

## Issues / Support

Add a set of links to the [issues](/templ-project/node-addon-node_api/issues) page/website, so people can know where to add issues/bugs or ask for support.

## License

(If the package is public, add licence)
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

<!-- ## Changelog

Small changelog history. The rest should be added to [CHANGELOG.md](CHANGELOG.md).

See here a template for changelogs: https://keepachangelog.com/en/1.0.0/

Also see this tool for automatically generating them: https://www.npmjs.com/package/changelog -->
