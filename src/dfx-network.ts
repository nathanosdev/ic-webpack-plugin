import type { IcWebpackPluginLogger } from './ic-webpack-plugin-logger';

export type NetworkName = string;

export function getDfxNetwork(logger: IcWebpackPluginLogger): NetworkName {
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
