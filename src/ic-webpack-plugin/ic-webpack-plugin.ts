import type { Compiler } from 'webpack';
import { IcCanisterPlugin } from '../ic-canister-plugin';
import { IcProxyPlugin } from '../ic-proxy-plugin';

export interface IcWebpackPluginOptions {
  disableProxy?: boolean | undefined | null;
}

export class IcWebpackPlugin {
  private options: IcWebpackPluginOptions;

  constructor(options?: IcWebpackPluginOptions | null | undefined) {
    this.options = options ?? {};
    this.options.disableProxy = this.options.disableProxy ?? false;
  }

  public apply(compiler: Compiler): void {
    new IcCanisterPlugin().apply(compiler);

    if (!this.options.disableProxy) {
      new IcProxyPlugin().apply(compiler);
    }
  }
}
