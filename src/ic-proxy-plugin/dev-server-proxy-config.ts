import { DfxNetworkConfig, DfxNetwork, getDfxNetworkAddress } from '../common';

export type WebpackDevServerProxyOptions = Record<string, unknown>;

export function mergeProxyOptions(
  originalProxyOptions: WebpackDevServerProxyOptions,
  dfxNetwork: DfxNetwork,
  dfxNetworkConfig: DfxNetworkConfig,
): WebpackDevServerProxyOptions {
  const networkBind = getDfxNetworkAddress(dfxNetwork, dfxNetworkConfig);

  return {
    '/api': {
      target: `http://${networkBind}`,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    },
    ...originalProxyOptions,
  };
}
