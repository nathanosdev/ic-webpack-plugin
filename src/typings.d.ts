declare namespace NodeJS {
  type EnvironmentVariable = string;

  interface ProcessEnv {
    NODE_ENV?: EnvironmentVariable;
    DFX_NETWORK?: EnvironmentVariable;
  }
}
