# Contributing

1. Clone the repository
1. Install npm modules
   ```shell
   $ npm i
   ```
1. Install pip
1. Install [Commitizen](https://commitizen-tools.github.io/commitizen/)
1. Commence hacking
1. Run tests and check coverage
   ```shell
   $ npm test:cov
   ```
1. Run linter
   ```shell
   $ npm run lint
   ```
1. Format files
   ```shell
   $ npm run format
   ```
1. Build
   ```shell
   $ npm run build
   ```
1. Link the package globally
   - (Exclude sudo on Windows)
   ```shell
   $ sudo npm link
   ```
1. In the directory to another project, link the package and test
   ```shell
   $ npm link @solec/ic-webpack-plugin
   ```
1. Stage your changes
   ```shell
   $ git add .
   ```
1. Commit your changes
   ```shell
   $ cz commit
   ```
