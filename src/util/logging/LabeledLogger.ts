import Logger from './Logger';
import Pino from 'pino';

export class LabeledLogger {
  private readonly logger: Pino.Logger = Logger;
  private logLabel: string;

  constructor(logLabel: string = '') {
    this.logLabel = logLabel;
  }

  info = (caller: string, message: string, ...args: any[]) =>
    this.logger.info(`${this.logLabel}:${caller} - ${message}`, args);

  error = (caller: string, message: string, ...args: any[]) =>
    this.logger.error(`${this.logLabel}:${caller} - ${message}`, args);

  warn = (caller: string, message: string, ...args: any[]) =>
    this.logger.warn(`${this.logLabel}:${caller} - ${message}`, args);
}
