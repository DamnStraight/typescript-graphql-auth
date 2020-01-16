import Pino from 'pino';

/**
 * Creates a new pino logging instance and returns it
 */
export const createLogger = (): Pino.Logger => {
  const loggingInstance = Pino(
    {
      prettyPrint: { colorize: true },
      // level: process.env.LOG_LEVEL,
      useLevelLabels: true,
    },
    process.stdout
  );

  return loggingInstance;
};

/**
 * Singleton instance of a pino logging object
 */
const Logger = createLogger();

export default Logger;
