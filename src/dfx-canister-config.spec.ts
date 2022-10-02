import * as fs from 'fs';
import * as path from 'path';
import { DfxCanisterConfig, getCanisterConfig } from './dfx-canister-config';

jest.mock('fs');
type ReadFileSync = typeof fs['readFileSync'];

describe('getCanisterConfig', () => {
  let readFileSyncMock: jest.SpyInstance<
    ReturnType<ReadFileSync>,
    Parameters<ReadFileSync>
  >;

  const canisterConfig: DfxCanisterConfig = {
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
  });

  it('should get the ic network from the root folder', () => {
    readFileSyncMock.mockReturnValue(canisterConfigBuffer);

    const result = getCanisterConfig('ic');

    expect(readFileSyncMock).toHaveBeenCalledWith(
      path.resolve('canister_ids.json'),
    );
    expect(result).toEqual(canisterConfig);
  });

  it.each(['local', 'testnet'])(
    'should get the %s network config from the .dfx folder',
    network => {
      readFileSyncMock.mockReturnValue(canisterConfigBuffer);

      const result = getCanisterConfig(network);

      expect(readFileSyncMock).toHaveBeenCalledWith(
        path.resolve('.dfx', network, 'canister_ids.json'),
      );
      expect(result).toEqual(canisterConfig);
    },
  );

  it('should throw if it cannot read the canister path', () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error('Path does not exist');
    });

    expect(() => getCanisterConfig('ic')).toThrowErrorMatchingSnapshot();
  });

  it('should throw if the file buffer cannot be decoded to JSON', () => {
    readFileSyncMock.mockReturnValue(Buffer.from(''));

    expect(() => getCanisterConfig('ic')).toThrowErrorMatchingSnapshot();
  });
});
