declare namespace NodeJS {
  type EnvironmentVariable = string | undefined;

  interface ProcessEnv {
    NODE_ENV: EnvironmentVariable;
    DFX_NETWORK: EnvironmentVariable;
  }
}
