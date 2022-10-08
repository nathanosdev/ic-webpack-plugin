import { EnvironmentPlugin, type Compiler } from 'webpack';
import {
  CanisterId,
  CanisterName,
  CanisterConfig,
  DfxNetwork,
  getCanisterConfig,
  getDfxNetwork,
  IcWebpackPluginLogger,
} from '../common';

type CanisterDefinitions = Record<CanisterName, CanisterId>;

export class IcCanisterPlugin {
  public apply(compiler: Compiler): void {
    const logger = compiler.getInfrastructureLogger('IcCanisterPlugin');

    const dfxNetwork = getDfxNetwork(logger);
    const canisterConfig = getCanisterConfig(dfxNetwork);
    const canisterDefinitions = this.getCanisterDefinitions(
      canisterConfig,
      dfxNetwork,
      logger,
    );

    new EnvironmentPlugin(canisterDefinitions).apply(compiler);
  }

  private getCanisterDefinitions(
    canisterConfig: CanisterConfig,
    dfxNetwork: DfxNetwork,
    logger: IcWebpackPluginLogger,
  ): CanisterDefinitions {
    return Object.entries(canisterConfig).reduce<CanisterDefinitions>(
      (accum, curr) => {
        const [canisterName, canisterDetails] = curr;
        const canisterEnvironmentName =
          canisterName.toUpperCase() + '_CANISTER_ID';
        const canisterId = canisterDetails[dfxNetwork] ?? '';

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
