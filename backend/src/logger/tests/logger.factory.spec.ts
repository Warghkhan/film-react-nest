import { createLogger } from '../logger.factory';
import { DevLogger } from '../dev.logger';
import { JsonLogger } from '../json.logger';
import { TskvLogger } from '../tskv.logger';

describe('createLogger', () => {
  it('should return DevLogger by default', () => {
    const logger = createLogger('without-any');
    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('should return DevLogger for "dev"', () => {
    const logger = createLogger('dev');
    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('should return JsonLogger for "json"', () => {
    const logger = createLogger('json');
    expect(logger).toBeInstanceOf(JsonLogger);
  });

  it('should return TskvLogger for "tskv"', () => {
    const logger = createLogger('tskv');
    expect(logger).toBeInstanceOf(TskvLogger);
  });

  it('should be case-insensitive and trim input', () => {
    expect(createLogger(' JSON ')).toBeInstanceOf(JsonLogger);
    expect(createLogger('TSKV')).toBeInstanceOf(TskvLogger);
    expect(createLogger('DeV')).toBeInstanceOf(DevLogger);
  });
});
