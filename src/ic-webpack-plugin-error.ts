import { WebpackError } from 'webpack';

export class IcWebpackPluginError extends WebpackError {
  constructor(message: string, originalError?: unknown) {
    super(message);

    const originalMessage =
      originalError instanceof Error
        ? originalError.message
        : String(originalError);

    this.details = originalMessage;
  }
}
