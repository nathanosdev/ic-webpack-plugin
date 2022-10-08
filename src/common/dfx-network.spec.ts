import { createMock } from 'ts-auto-mock';
import { getDfxNetwork } from './dfx-network';
import type { IcWebpackPluginLogger } from './ic-webpack-plugin-logger';

describe('getDfxNetwork', () => {
  let loggerMock: IcWebpackPluginLogger;

  beforeEach(() => {
    loggerMock = createMock<IcWebpackPluginLogger>({
      log: jest.fn(),
    });

    delete process.env.DFX_NETWORK;
    delete process.env.NODE_ENV;
  });

  it.each(['local', 'testnet', 'ic'])(
    'should return %s if it is set explicitly on DFX_NETWORK',
    dfxNetwork => {
      process.env.DFX_NETWORK = dfxNetwork;

      const result = getDfxNetwork(loggerMock);

      expect(result).toEqual(dfxNetwork);
    },
  );

  it('should return ic if NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';

    const result = getDfxNetwork(loggerMock);

    expect(result).toEqual('ic');
  });

  it('should return local if DFX_NETWORK and NODE_ENV are not set', () => {
    const result = getDfxNetwork(loggerMock);

    expect(result).toEqual('local');
  });
});
