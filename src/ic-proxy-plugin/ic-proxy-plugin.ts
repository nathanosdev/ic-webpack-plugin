import type { Compiler } from 'webpack';
import { getDfxConfig, getDfxNetwork } from '../common';
import { mergeDevServerConfig } from './dev-server-config';

export class IcProxyPlugin {
  public apply(compiler: Compiler): void {
    const logger = compiler.getInfrastructureLogger('IcProxyPlugin');

    const dfxConfig = getDfxConfig();
    const dfxNetwork = getDfxNetwork(logger);
    const dfxNetworkConfig = dfxConfig.networks?.[dfxNetwork] ?? null;

    if (dfxNetworkConfig === null) {
      logger.log(
        `No network config found for ${dfxNetwork}, skipping webpack proxy setup`,
      );

      return;
    }

    compiler.hooks.afterEnvironment.tap('IcProxyPlugin', () => {
      compiler.options.devServer = mergeDevServerConfig(
        compiler.options,
        dfxConfig,
        dfxNetwork,
        dfxNetworkConfig,
      );
    });
  }
}
