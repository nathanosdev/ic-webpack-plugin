import fs from 'fs';
import path from 'path';
import {
  getDfxAssetCanisterConfig,
  getDfxConfig,
  getDfxNetworkAddress,
} from './dfx-config';
import type { DfxConfig, DfxNetworkConfig } from './dfx-config-schema';

jest.mock('path');
jest.mock('fs');

describe('getDfxConfig', () => {
  let pathResolveSpy: jest.SpyInstance;
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    pathResolveSpy = jest.spyOn(path, 'resolve');
    readFileSpy = jest.spyOn(fs, 'readFileSync');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load a dfx.json file', () => {
    const path = __dirname + '/foo/bar';
    pathResolveSpy.mockReturnValue(path);
    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: {
        local: { bind: 'https://fake-network.com' },
        mainnet: { bind: 'https://fake-network.com' },
      },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    const result = getDfxConfig();

    expect(pathResolveSpy).toHaveBeenCalledWith('dfx.json');
    expect(readFileSpy).toHaveBeenCalledWith(path);
    expect(result).toEqual(dfxConfig);
  });
});

describe('getDfxAssetCanisterConfig', () => {
  it('should return the asset canister config', () => {
    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: {
        local: { bind: 'https://fake-network.com' },
        mainnet: { bind: 'https://fake-network.com' },
      },
    };

    const result = getDfxAssetCanisterConfig(dfxConfig);

    expect(result).toEqual(dfxConfig.canisters?.['frontend']);
  });

  it('should throw if there are no asset canisters', () => {
    const dfxConfig: DfxConfig = {
      canisters: {
        backend: {
          type: 'motoko',
        },
      },
      networks: {
        local: { bind: 'https://fake-network.com' },
        mainnet: { bind: 'https://fake-network.com' },
      },
    };

    expect(() =>
      getDfxAssetCanisterConfig(dfxConfig),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if there are no canisters at all', () => {
    const dfxConfig: DfxConfig = {
      networks: {
        local: { bind: 'https://fake-network.com' },
        mainnet: { bind: 'https://fake-network.com' },
      },
    };

    expect(() =>
      getDfxAssetCanisterConfig(dfxConfig),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if there is more than one asset canister', () => {
    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [],
        },
        another_frontend: {
          type: 'assets',
          source: [],
        },
      },
      networks: {
        local: { bind: 'https://fake-network.com' },
        mainnet: { bind: 'https://fake-network.com' },
      },
    };

    expect(() =>
      getDfxAssetCanisterConfig(dfxConfig),
    ).toThrowErrorMatchingSnapshot();
  });
});

describe('getDfxNetworkAddress', () => {
  const dfxNetwork = 'local';

  it('should return the network address for a standard network config', () => {
    const dfxNetworkConfig: DfxNetworkConfig = {
      bind: 'https://fake-network.com',
    };

    const result = getDfxNetworkAddress(dfxNetwork, dfxNetworkConfig);

    expect(result).toEqual(dfxNetworkConfig.bind);
  });

  it('should return the first provider for a custom network config', () => {
    const dfxNetworkConfig: DfxNetworkConfig = {
      providers: ['https://fake-network.com'],
    };

    const result = getDfxNetworkAddress(dfxNetwork, dfxNetworkConfig);

    expect(result).toEqual(dfxNetworkConfig.providers[0]);
  });

  it('should throw if there is no provider for a custom network config', () => {
    const dfxNetworkConfig: DfxNetworkConfig = {
      providers: [],
    };

    expect(() =>
      getDfxNetworkAddress(dfxNetwork, dfxNetworkConfig),
    ).toThrowErrorMatchingSnapshot();
  });
});
