import { EnvironmentPlugin, type Compiler } from 'webpack';
import {
  CanisterId,
  CanisterName,
  DfxCanisterConfig,
  getCanisterConfig,
} from './dfx-canister-config';
import { getDfxNetwork } from './dfx-network';
import type { IcWebpackPluginLogger } from './ic-webpack-plugin-logger';

type CanisterDefinitions = Record<CanisterName, CanisterId>;

export class IcCanisterPlugin {
  public apply(compiler: Compiler, logger: IcWebpackPluginLogger): void {
    const network = getDfxNetwork(logger);
    const canisterConfig = getCanisterConfig(network);
    const canisterDefinitions = this.getCanisterDefinitions(
      logger,
      canisterConfig,
      network,
    );

    new EnvironmentPlugin(canisterDefinitions).apply(compiler);
  }

  private getCanisterDefinitions(
    logger: IcWebpackPluginLogger,
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
}
