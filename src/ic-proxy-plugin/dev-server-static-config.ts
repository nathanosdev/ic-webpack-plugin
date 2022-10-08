import path from 'path';
import type { WebpackOptionsNormalized } from 'webpack';
import {
  DfxAssetCanisterConfig,
  DfxConfig,
  getDfxAssetCanisterConfig,
} from '../common';

export interface WebpackDevServerStaticFolder {
  directory: string;
}

export type WebpackDevServerStaticOptions =
  | boolean
  | string
  | string[]
  | WebpackDevServerStaticFolder
  | WebpackDevServerStaticFolder[]
  | (WebpackDevServerStaticFolder | string)[];

function getAssetCanisterStaticSources(
  outputOptions: WebpackOptionsNormalized['output'],
  assetCanisterConfig: DfxAssetCanisterConfig,
): WebpackDevServerStaticFolder[] {
  const outputPath = outputOptions.path ?? null;
  if (!outputPath) {
    return [];
  }

  const normalizedOutputPath = path.resolve(outputPath);
  const normalizedSources = assetCanisterConfig.source.map(source =>
    path.resolve(source),
  );

  return normalizedSources
    .filter(source => !source.startsWith(normalizedOutputPath))
    .map(source => ({
      directory: source,
    }));
}

export function mergeStaticOptions(
  dfxConfig: DfxConfig,
  outputOptions: WebpackOptionsNormalized['output'],
  originalStaticOptions: WebpackDevServerStaticOptions | undefined,
): WebpackDevServerStaticOptions {
  const assetCanisterConfig = getDfxAssetCanisterConfig(dfxConfig);

  const staticSources = getAssetCanisterStaticSources(
    outputOptions,
    assetCanisterConfig,
  );

  if (originalStaticOptions === false) {
    return false;
  }

  if (Array.isArray(originalStaticOptions)) {
    return [...originalStaticOptions, ...staticSources];
  }

  if (
    typeof originalStaticOptions === 'string' ||
    typeof originalStaticOptions === 'object'
  ) {
    return [originalStaticOptions, ...staticSources];
  }

  return staticSources;
}
