import { createMock } from 'ts-auto-mock';
import type { Compiler } from 'webpack';
import fs from 'fs';
import path from 'path';
import { IcProxyPlugin } from './ic-proxy-plugin';
import type { DfxConfig } from '../common';

jest.mock('fs');
jest.mock('path');

describe('IcProxyPlugin', () => {
  let plugin: IcProxyPlugin;

  let compilerMock: Compiler;
  let tapMock: jest.Mock;
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    readFileSpy = jest.spyOn(fs, 'readFileSync');
    jest.spyOn(path, 'resolve').mockImplementation(path => path);

    tapMock = jest.fn().mockImplementation((_, callback: () => void) => {
      callback();
    });
    compilerMock = createMock<Compiler>({
      options: {
        output: {
          path: path.resolve('./dist/hello_ic_frontend'),
        },
      },
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });
    plugin = new IcProxyPlugin();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should merge dev server config options', () => {
    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should not do anything if there is no network config', () => {
    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: {},
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should not add static assets if there is no output path', () => {
    compilerMock = createMock<Compiler>({
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });

    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should not add static assets if static assets is disabled', () => {
    compilerMock = createMock<Compiler>({
      options: {
        output: {
          path: path.resolve('./dist/hello_ic_frontend'),
        },
        devServer: {
          static: false,
        },
      },
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });

    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should merge with existing static assets array', () => {
    compilerMock = createMock<Compiler>({
      options: {
        output: {
          path: path.resolve('./dist/hello_ic_frontend'),
        },
        devServer: {
          static: ['other-src/assets'],
        },
      },
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });

    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should merge with existing static assets string', () => {
    compilerMock = createMock<Compiler>({
      options: {
        output: {
          path: path.resolve('./dist/hello_ic_frontend'),
        },
        devServer: {
          static: 'other-src/assets',
        },
      },
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });

    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });

  it('should merge with existing static assets object', () => {
    compilerMock = createMock<Compiler>({
      options: {
        output: {
          path: path.resolve('./dist/hello_ic_frontend'),
        },
        devServer: {
          static: {
            directory: 'other-src/assets',
          },
        },
      },
      hooks: {
        afterEnvironment: {
          tap: tapMock,
        },
      },
    });

    const dfxConfig: DfxConfig = {
      canisters: {
        frontend: {
          type: 'assets',
          source: [
            'src/hello_ic_frontend/assets',
            'src/hello_ic_frontend/css',
            'dist/hello_ic_frontend/',
          ],
        },
        backend: {
          type: 'motoko',
        },
      },
      networks: { local: { bind: 'https://fake-network.com' } },
    };
    readFileSpy.mockReturnValue(Buffer.from(JSON.stringify(dfxConfig)));

    plugin.apply(compilerMock);

    expect(compilerMock.options.devServer).toMatchSnapshot();
  });
});
