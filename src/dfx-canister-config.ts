import path from 'path';
import fs from 'fs';
import { IcWebpackPluginError } from './ic-webpack-plugin-error';
import type { NetworkName } from './dfx-network';

export type CanisterName = string;
export type CanisterId = string;

export type DfxCanisterNetworkConfig = Record<NetworkName, CanisterId>;
export type DfxCanisterConfig = Record<CanisterName, DfxCanisterNetworkConfig>;

export function getCanisterConfig(network: NetworkName): DfxCanisterConfig {
  const canisterConfigPath =
    network === 'ic'
      ? path.resolve('canister_ids.json')
      : path.resolve('.dfx', network, 'canister_ids.json');

  let canisterConfigBuffer: Buffer | undefined;
  try {
    canisterConfigBuffer = fs.readFileSync(canisterConfigPath);
  } catch (error) {
    throw new IcWebpackPluginError(
      `Error loading ${canisterConfigPath}`,
      error,
    );
  }

  const canisterConfigString = canisterConfigBuffer.toString();

  let canisterConfig: DfxCanisterConfig | undefined;
  try {
    canisterConfig = JSON.parse(canisterConfigString) as DfxCanisterConfig;
  } catch (error) {
    throw new IcWebpackPluginError(
      `Error parsing the content of ${canisterConfigPath} into JSON`,
      error,
    );
  }

  return canisterConfig;
}
