import path from 'path';
import fs from 'fs';
import {
  Compilation,
  EnvironmentPlugin,
  WebpackError,
  type Compiler,
} from 'webpack';

type CanisterName = string;
type CanisterId = string;
type NetworkName = string;
type DfxCanisterNetworkConfig = Record<NetworkName, CanisterId>;
type DfxCanisterConfig = Record<CanisterName, DfxCanisterNetworkConfig>;

type CanisterDefinitions = Record<CanisterName, CanisterId>;

type WebpackLogger = ReturnType<Compilation['getLogger']>;

const PLUGIN_NAME = 'IcCanisterPlugin';
class IcCanisterPlugin {
  public apply(compiler: Compiler): void {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);

    const network = this.getNetwork(logger);
    const canisterConfig = this.getCanisterConfig(logger, network);
    const canisterDefinitions = this.getCanisterDefinitions(
      logger,
      canisterConfig,
      network,
    );

    new EnvironmentPlugin(canisterDefinitions).apply(compiler);
  }

  private getNetwork(logger: WebpackLogger): string {
    const dfxNetwork = process.env.DFX_NETWORK ?? null;
    const nodeEnv = process.env.NODE_ENV ?? null;

    if (dfxNetwork !== null) {
      logger.log(`dfx network explicitly set to ${dfxNetwork}`);
      return dfxNetwork;
    } else {
      logger.log('dfx network not explicitly set');
    }

    if (nodeEnv === 'production') {
      logger.log('Production mode set, using mainnet dfx network');
      return 'ic';
    }

    logger.log('Defaulting to use local network');
    return 'local';
  }

  private getCanisterConfig(
    _logger: WebpackLogger,
    network: string,
  ): DfxCanisterConfig {
    const canisterConfigPath =
      network === 'ic'
        ? path.resolve('canister_ids.json')
        : path.resolve('.dfx', network, 'canister_ids.json');

    let canisterConfigBuffer: Buffer | undefined;
    try {
      canisterConfigBuffer = fs.readFileSync(canisterConfigPath);
    } catch (error) {
      throw this.createError(`Error loading ${canisterConfigPath}`, error);
    }

    let canisterConfigString: string | undefined;
    try {
      canisterConfigString = canisterConfigBuffer.toString();
    } catch (error) {
      throw this.createError(
        `Error decoding the content of ${canisterConfigPath} into a string`,
        error,
      );
    }

    let canisterConfig: DfxCanisterConfig | undefined;
    try {
      canisterConfig = JSON.parse(canisterConfigString) as DfxCanisterConfig;
    } catch (error) {
      throw this.createError(
        `Error parsing the content of ${canisterConfigPath} into JSON`,
        error,
      );
    }

    return canisterConfig;
  }

  private getCanisterDefinitions(
    logger: WebpackLogger,
    canisterConfig: DfxCanisterConfig,
    network: string,
  ): CanisterDefinitions {
    return Object.entries(canisterConfig).reduce<CanisterDefinitions>(
      (accum, curr) => {
        const [canisterName, canisterDetails] = curr;
        const canisterEnvironmentName =
          canisterName.toUpperCase() + '_CANISTER_ID';
        const canisterId = canisterDetails[network] ?? '';

        logger.log(
          `Set ${canisterName} environment variable ${canisterEnvironmentName} to ${canisterId}`,
        );

        return {
          ...accum,
          [canisterEnvironmentName]: canisterId,
        };
      },
      {},
    );
  }

  private createError(message: string, originalError?: unknown): WebpackError {
    const originalMessage =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);

    const error = new WebpackError(message);
    error.details = originalMessage;

    return error;
  }
}

export = IcCanisterPlugin;
