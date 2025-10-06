import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const fields: string[] = [];

    fields.push(`level=${level}`);
    fields.push(`timestamp=${new Date().toISOString()}`);
    fields.push(`message=${String(message)}`);

    optionalParams.forEach((param, index) => {
      if (typeof param === 'object' && param !== null) {
        Object.entries(param).forEach(([key, value]) => {
          fields.push(`${key}=${String(value)}`);
        });
      } else {
        fields.push(`param${index}=${String(param)}`);
      }
    });

    return fields.join('\t');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
