# IC Canister Plugin

## Overview

A Webpack plugin to find your Internet Computer canister Ids and create environment variables for them.

[![Build](https://github.com/Solec-Labs/ic-canister-plugin/actions/workflows/build.yml/badge.svg)](https://github.com/Solec-Labs/ic-canister-plugin/actions/workflows/build.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```shell
$ npm i -D @solec/ic-canister-plugin
```

## Usage

In your `webpack.config.js` file, add this plugin to your `plugins` array:

```javascript
const IcCanisterPlugin = require('@solec/ic-canister-plugin');

module.exports = {
  plugins: [new IcCanisterPlugin()],
};
```

## Contributing

1. Clone the repository
1. Install npm modules
   ```shell
   $ npm i
   ```
1. Commence hacking
1. Stage your changes
   ```shell
   $ git add .
   ```
1. Commit your changes
   ```shell
   $ npm run commit
   ```
