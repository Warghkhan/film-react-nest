import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const logObject: any = {
      timestamp: new Date().toISOString(),
      level,
      message:
        typeof message === 'object' ? JSON.stringify(message) : String(message),
    };

    for (const param of optionalParams) {
      if (
        typeof param === 'object' &&
        param !== null &&
        !Array.isArray(param)
      ) {
        Object.assign(logObject, param);
      } else {
        logObject.additional = logObject.additional || [];
        logObject.additional.push(String(param));
      }
    }

    return JSON.stringify(logObject);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.info(this.formatMessage('verbose', message, ...optionalParams));
  }
}
