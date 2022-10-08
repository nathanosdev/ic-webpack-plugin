import type { Compilation } from 'webpack';

export type IcWebpackPluginLogger = ReturnType<Compilation['getLogger']>;
