import type { Compiler } from 'webpack';
import { IcCanisterPlugin } from './ic-canister-plugin';

const PLUGIN_NAME = 'IcWebpackPlugin';
export class IcWebpackPlugin {
  public apply(compiler: Compiler): void {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);

    new IcCanisterPlugin().apply(compiler, logger);
  }
}
