//#region CanisterConfiguration
interface RustCanisterConfiguration {
  candid: string;
  package: string;
  type: 'rust';
  [k: string]: unknown;
}

export interface DfxAssetCanisterConfig {
  source: string[];
  type: 'assets';
  [k: string]: unknown;
}

interface CustomCanisterConfiguration {
  build: string | string[];
  candid: string;
  type: 'custom';
  wasm: string;
  [k: string]: unknown;
}

interface MotokoCanisterConfiguration {
  type: 'motoko';
  [k: string]: unknown;
}

export type DfxCanisterConfig =
  | RustCanisterConfiguration
  | DfxAssetCanisterConfig
  | CustomCanisterConfiguration
  | MotokoCanisterConfiguration;
//#endregion CanisterConfiguration

type LoggingLevel =
  | 'critical'
  | 'error'
  | 'warning'
  | 'info'
  | 'debug'
  | 'trace'
  | string;

type SubnetType = 'system' | 'application' | 'verifiedapplication' | null;

export type NetworkType = 'ephemeral' | 'persistent';

//#region NetworkConfiguration
export interface DfxCustomNetworkConfig {
  providers: string[];
  type?: NetworkType & string;
  [k: string]: unknown;
}

export interface LocalNetworkConfiguration {
  bind: string;
  bitcoin?: BitcoinAdapterConfiguration | null;
  bootstrap?: BootstrapServerConfiguration | null;
  canister_http?: HTTPAdapterConfiguration | null;
  replica?: LocalReplicaConfiguration | null;
  type?: NetworkType & string;
  [k: string]: unknown;
}

export type DfxNetworkConfig =
  | DfxCustomNetworkConfig
  | LocalNetworkConfiguration;
//#endregion NetworkConfiguration

export interface DfxConfig {
  canisters?: Record<string, DfxCanisterConfig> | null;
  defaults?: ConfigDefaults | null;
  dfx?: string | null;
  networks?: Record<string, DfxNetworkConfig> | null;
  profile?: 'Debug' | 'Release' | null;
  version?: number | null;
}

interface ConfigDefaults {
  bitcoin?: BitcoinAdapterConfiguration | null;
  bootstrap?: BootstrapServerConfiguration | null;
  build?: BuildProcessConfiguration | null;
  canister_http?: HTTPAdapterConfiguration | null;
  replica?: LocalReplicaConfiguration | null;
  [k: string]: unknown;
}

interface BitcoinAdapterConfiguration {
  enabled?: boolean;
  log_level?: LoggingLevel;
  nodes?: string[] | null;
  [k: string]: unknown;
}

interface BootstrapServerConfiguration {
  ip?: string | null;
  port?: number | null;
  timeout?: number | null;
  [k: string]: unknown;
}

interface BuildProcessConfiguration {
  args?: string | null;
  packtool?: string | null;
  [k: string]: unknown;
}

interface HTTPAdapterConfiguration {
  enabled?: boolean;
  [k: string]: unknown;
}

interface LocalReplicaConfiguration {
  port?: number | null;
  subnet_type?: SubnetType;
  [k: string]: unknown;
}
