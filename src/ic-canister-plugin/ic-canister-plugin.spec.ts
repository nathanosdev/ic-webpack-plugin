import * as fs from 'fs';
import * as webpack from 'webpack';
import { createMock } from 'ts-auto-mock';
import { On, method } from 'ts-auto-mock/extension';
import type { Compiler } from 'webpack';
import type { CanisterConfig, IcWebpackPluginLogger } from '../common';
import { IcCanisterPlugin } from './ic-canister-plugin';

jest.mock('fs');

jest.mock('webpack', () => {
  const realWebpack = jest.requireActual<typeof webpack>('webpack');

  return {
    WebpackError: realWebpack.WebpackError,
    EnvironmentPlugin: jest.fn(() => ({ apply: jest.fn() })),
  };
});

describe('IcCanisterPlugin', () => {
  let plugin: IcCanisterPlugin;

  let loggerMock: IcWebpackPluginLogger;
  let compilerMock: Compiler;
  let readFileSyncMock: jest.SpyInstance;
  let environmentPluginMock: jest.SpyInstance;

  const canisterConfig: CanisterConfig = {
    canister_frontend: {
      local: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
      testnet: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
      ic: 'r7inp-6aaaa-aaaaa-aaabq-cai',
    },
    canister_backend: {
      local: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
      testnet: 'renrk-eyaaa-aaaaa-aaada-cai',
      ic: 'rno2w-sqaaa-aaaaa-aaacq-cai',
    },
  };
  const canisterConfigString = JSON.stringify(canisterConfig);
  const canisterConfigBuffer = Buffer.from(canisterConfigString);

  beforeEach(() => {
    readFileSyncMock = jest.spyOn(fs, 'readFileSync');

    compilerMock = createMock<Compiler>();
    loggerMock = createMock<IcWebpackPluginLogger>({
      log: jest.fn(),
    });
    On(compilerMock)
      .get(method('getInfrastructureLogger'))
      .mockReturnValue(loggerMock);

    environmentPluginMock = jest.spyOn(webpack, 'EnvironmentPlugin');

    plugin = new IcCanisterPlugin();

    delete process.env.DFX_NETWORK;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an EnviornmentPlugin with the local canister definitions', () => {
    readFileSyncMock.mockReturnValue(canisterConfigBuffer);

    plugin.apply(compilerMock);

    expect(environmentPluginMock).toHaveBeenCalledTimes(1);
    expect(environmentPluginMock.mock.calls[0]).toMatchSnapshot();
  });

  it('should create an EnviornmentPlugin with the mainnet canister definitions', () => {
    readFileSyncMock.mockReturnValue(canisterConfigBuffer);
    process.env.NODE_ENV = 'production';

    plugin.apply(compilerMock);

    expect(environmentPluginMock).toHaveBeenCalledTimes(1);
    expect(environmentPluginMock.mock.calls[0]).toMatchSnapshot();
  });

  it('should create an EnviornmentPlugin with explicitly defined canister definitions', () => {
    readFileSyncMock.mockReturnValue(canisterConfigBuffer);
    process.env.DFX_NETWORK = 'testnet';

    plugin.apply(compilerMock);

    expect(environmentPluginMock).toHaveBeenCalledTimes(1);
    expect(environmentPluginMock.mock.calls[0]).toMatchSnapshot();
  });
});
