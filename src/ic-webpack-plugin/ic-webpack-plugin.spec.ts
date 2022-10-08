import type { Compiler } from 'webpack';
import { createMock } from 'ts-auto-mock';
import * as IcCanisterPluginModule from '../ic-canister-plugin';
import * as IcProxyPluginModule from '../ic-proxy-plugin';
import { IcWebpackPlugin } from './ic-webpack-plugin';

jest.mock('../ic-canister-plugin');
jest.mock('../ic-proxy-plugin');

describe('IcWebpackPlugin', () => {
  let plugin: IcWebpackPlugin;

  let compilerMock: Compiler;
  let icCanisterPluginMock: jest.SpyInstance;
  let icProxyPluginMock: jest.SpyInstance;

  beforeEach(() => {
    compilerMock = createMock<Compiler>();

    icCanisterPluginMock = jest.spyOn(
      IcCanisterPluginModule,
      'IcCanisterPlugin',
    );
    icProxyPluginMock = jest.spyOn(IcProxyPluginModule, 'IcProxyPlugin');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an IcCanisterPlugin and IcProxyPlugin', () => {
    plugin = new IcWebpackPlugin();

    plugin.apply(compilerMock);

    expect(icCanisterPluginMock).toBeCalledTimes(1);
    expect(icProxyPluginMock).toBeCalledTimes(1);
  });

  it('should not create an IcProxyPlugin', () => {
    plugin = new IcWebpackPlugin({ disableProxy: true });

    plugin.apply(compilerMock);

    expect(icCanisterPluginMock).toBeCalledTimes(1);
    expect(icProxyPluginMock).toBeCalledTimes(0);
  });
});
