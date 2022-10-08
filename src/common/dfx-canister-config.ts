import path from 'path';
import type { DfxNetwork } from './dfx-network';
import { loadJsonFile } from './load-json-file';

export type CanisterName = string;
export type CanisterId = string;

export type CanisterNetworkConfig = Record<DfxNetwork, CanisterId>;
export type CanisterConfig = Record<CanisterName, CanisterNetworkConfig>;

export function getCanisterConfig(network: DfxNetwork): CanisterConfig {
  const canisterConfigPath =
    network === 'ic'
      ? path.resolve('canister_ids.json')
      : path.resolve('.dfx', network, 'canister_ids.json');

  return loadJsonFile(canisterConfigPath);
}
