import fs from 'fs';
import { IcWebpackPluginError } from './ic-webpack-plugin-error';

export function loadJsonFile<T>(path: string): T {
  let canisterConfigBuffer: Buffer | undefined;
  try {
    canisterConfigBuffer = fs.readFileSync(path);
  } catch (error) {
    throw new IcWebpackPluginError(`Error loading ${path}`, error);
  }

  const canisterConfigString = canisterConfigBuffer.toString();

  let canisterConfig: T | undefined;
  try {
    canisterConfig = JSON.parse(canisterConfigString) as T;
  } catch (error) {
    throw new IcWebpackPluginError(
      `Error parsing the content of ${path} into JSON`,
      error,
    );
  }

  return canisterConfig;
}
