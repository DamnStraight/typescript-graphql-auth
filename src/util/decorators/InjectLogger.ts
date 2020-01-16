import { LabeledLogger } from "../logging/LabeledLogger";

/**
 * Injects a singleton instance of a pino logger function
 */
export const InjectLogger = (logLabel: string = "") => {
  const logInstance = new LabeledLogger(logLabel);
  return (target: any, key: string) => {
    const getter = () => {
      return logInstance;
    };

    Object.defineProperty(target, key, {
      get: getter,
    });
  };
};
