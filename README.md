# IC Webpack Plugin

## Overview

A Webpack plugin to find your Internet Computer canister Ids and create environment variables for them.

[![Build status](https://img.shields.io/github/workflow/status/Solec-Labs/ic-webpack-plugin/Merge)](https://github.com/Solec-Labs/ic-webpack-plugin/actions/workflows/merge.yml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen-tools.github.io/commitizen/)
[![Dependencies](https://img.shields.io/librariesio/release/npm/@solec/ic-webpack-plugin)](https://www.npmjs.com/package/@solec/ic-webpack-plugin)
[![Latest Version](https://img.shields.io/npm/v/@solec/ic-webpack-plugin)](https://www.npmjs.com/package/@solec/ic-webpack-plugin)
[![License](https://img.shields.io/github/license/Solec-Labs/ic-webpack-plugin)](./LICENSE)

## What It Does

- Loads canister IDs from `canister_ids.json` and provides environment variables for `agent-js`.
- Sets up a proxy for an IC network - local, production or an alternative network that you configure.
- Detects your static assets from `dfx.json` and serves them through Webpack Dev Server.

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

## Building For Production

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

Then you can build for the `ic` network using `dfx`:

```shell
$ dfx build --network ic
```

Or deploy to the `ic` network using `dfx`:

```shell
$ dfx deploy --network ic
```

## Building For An Alternative Network

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

Then you can build for your alternative network using `dfx`:

```shell
$ dfx build --network testnet
```

Or deploy to your alternative network using `dfx`:

```shell
$ dfx deploy --network testnet
```

The plugin will automatically pick up the network that you've selected through `dfx`.

## Contributing

Check out our [Contribution Guide](./CONTRIBUTING.md).
