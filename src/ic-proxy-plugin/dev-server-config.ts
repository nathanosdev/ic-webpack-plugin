import type { WebpackOptionsNormalized } from 'webpack';
import type { DfxNetworkConfig, DfxNetwork, DfxConfig } from '../common';
import {
  mergeProxyOptions,
  WebpackDevServerProxyOptions,
} from './dev-server-proxy-config';
import {
  mergeStaticOptions,
  WebpackDevServerStaticOptions,
} from './dev-server-static-config';

export interface WebpackDevServerOptions {
  [index: string]: unknown;
  static?: WebpackDevServerStaticOptions;
  proxy?: WebpackDevServerProxyOptions;
  output?: WebpackOptionsNormalized['output'];
}

export function mergeDevServerConfig(
  webpackOptions: WebpackOptionsNormalized | undefined,
  dfxConfig: DfxConfig,
  dfxNetwork: DfxNetwork,
  dfxNetworkConfig: DfxNetworkConfig,
): WebpackDevServerOptions {
  const webpackDevServerOptions: WebpackDevServerOptions =
    webpackOptions?.devServer ?? {};

  const devServerStaticOptions = mergeStaticOptions(
    dfxConfig,
    webpackOptions?.output ?? {},
    webpackDevServerOptions.static,
  );
  const devServerProxyOptions = mergeProxyOptions(
    webpackDevServerOptions.proxy ?? {},
    dfxNetwork,
    dfxNetworkConfig,
  );

  const devServerOptions = {
    ...webpackDevServerOptions,
    static: devServerStaticOptions,
    proxy: devServerProxyOptions,
  };

  return devServerOptions;
}
