import path from 'path';
import type {
  DfxAssetCanisterConfig,
  DfxCanisterConfig,
  DfxNetworkConfig,
  DfxConfig,
  DfxCustomNetworkConfig,
} from './dfx-config-schema';
import type { DfxNetwork } from './dfx-network';
import { IcWebpackPluginError } from './ic-webpack-plugin-error';
import { loadJsonFile } from './load-json-file';

export function getDfxConfig(): DfxConfig {
  const dfxPath = path.resolve('dfx.json');

  return loadJsonFile<DfxConfig>(dfxPath);
}

function isAssetCanister(
  canisterConfig: DfxCanisterConfig,
): canisterConfig is DfxAssetCanisterConfig {
  return canisterConfig.type === 'assets';
}

export function getDfxAssetCanisterConfig(
  dfxConfig: DfxConfig,
): DfxAssetCanisterConfig {
  const canisters = dfxConfig.canisters ?? {};
  const assetCanisters =
    Object.values(canisters).filter<DfxAssetCanisterConfig>(isAssetCanister);

  if (assetCanisters.length === 0 || !assetCanisters[0]) {
    throw new IcWebpackPluginError(
      'Could not find an asset canister in dfx.json',
    );
  }

  if (assetCanisters.length > 1) {
    throw new IcWebpackPluginError(
      'More than one asset canister found, only one is supported',
    );
  }

  return assetCanisters[0];
}

function isCustomNetwork(
  dfxNetworkConfig: DfxNetworkConfig,
): dfxNetworkConfig is DfxCustomNetworkConfig {
  return 'providers' in dfxNetworkConfig;
}

function getCustomNetworkProvider(
  dfxNetwork: DfxNetwork,
  dfxNetworkConfig: DfxCustomNetworkConfig,
): string {
  for (const provider of dfxNetworkConfig.providers) {
    if (provider && typeof provider === 'string') {
      return provider;
    }
  }

  throw new IcWebpackPluginError(
    `Could not find provider for custom network: ${dfxNetwork}`,
  );
}

export function getDfxNetworkAddress(
  dfxNetwork: DfxNetwork,
  dfxNetworkConfig: DfxNetworkConfig,
): string {
  return isCustomNetwork(dfxNetworkConfig)
    ? getCustomNetworkProvider(dfxNetwork, dfxNetworkConfig)
    : dfxNetworkConfig.bind;
}
