import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export function createLogger(type: string) {
  switch (type.trim().toLowerCase()) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
      return new DevLogger();
    default:
      console.log('Logger type is undefined. Return dev logger.');
      return new DevLogger();
  }
}
