import type { Compiler } from 'webpack';
import { createMock } from 'ts-auto-mock';
import * as IcCanisterPluginModule from './ic-canister-plugin';
import { IcWebpackPlugin } from './ic-webpack-plugin';

jest.mock('./ic-canister-plugin');

describe('IcWebpackPlugin', () => {
  let plugin: IcWebpackPlugin;
  let icCanisterPluginMock: jest.SpyInstance;

  let compilerMock: Compiler;

  beforeEach(() => {
    compilerMock = createMock<Compiler>();
    icCanisterPluginMock = jest.spyOn(
      IcCanisterPluginModule,
      'IcCanisterPlugin',
    );

    plugin = new IcWebpackPlugin();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an IcCanisterPlugin', () => {
    plugin.apply(compilerMock);

    expect(icCanisterPluginMock).toBeCalledTimes(1);
  });
});
