# IC Canister Plugin

## Overview

A Webpack plugin to find your Internet Computer canister Ids and create environment variables for them.

[![Build](https://github.com/Solec-Labs/ic-webpack-plugin/actions/workflows/build.yml/badge.svg)](https://github.com/Solec-Labs/ic-webpack-plugin/actions/workflows/build.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```shell
$ npm i -D @solec/ic-webpack-plugin
```

## Usage

In your `webpack.config.js` file, add this plugin to your `plugins` array:

```javascript
const IcWebpackPlugin = require('@solec/ic-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new IcWebpackPlugin(),
  ],
};
```

## Using an alternative network

The plugin will automatically load the canister IDs from `.dfx/local/canister_ids.json`.
If you need to specify a different network, you can set the `DFX_NETWORK` variable.

In your `dfx.json` file, add another network, for example:

```json
{
  "networks": {
    // ...
    "testnet": {
      "bind": "127.0.0.1:8000", // insert your network's URL here
      "type": "ephemeral"
    }
  }
}
```

Create your canisters on the network:

```shell
$ dfx canister --network testnet create --all
```

Then deploy your canisters:

```shell
$ dfx deploy --network testnet
```

The plugin will automatically pick up the network that you've selected through `dfx`.

## Production

When `--network` is set to `ic` through `dfx`, or `NODE_ENV` is to `production` then canister IDs will be read from a `canister_ids.json` file in the root of your directory.
That file should be structured like this:

```json
{
  "${canister_name}": {
    "ic": "${canister-id}"
  },
  "${canister_name}": {
    "ic": "${canister-id}"
  }
}
```

## Contributing

1. Clone the repository
1. Install npm modules
   ```shell
   $ npm i
   ```
1. Commence hacking
1. Install pip
1. Install [Commitizen](https://commitizen-tools.github.io/commitizen/)
1. Stage your changes
   ```shell
   $ git add .
   ```
1. Commit your changes
   ```shell
   $ cz commit
   ```
