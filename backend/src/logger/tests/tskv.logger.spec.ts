import { TskvLogger } from '../tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log in TSKV format', () => {
    logger.log('User logged in', { userId: 123, ip: '192.168.1.1' });

    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(callArg).toContain('level=log');
    expect(callArg).toContain('message=User logged in');
    expect(callArg).toContain('userId=123');
    expect(callArg).toContain('ip=192.168.1.1');
    expect(callArg.split('\t')).toHaveLength(5); // level, timestamp, message, userId, ip
  });

  it('should handle primitive optional params', () => {
    logger.warn('Warning', 'extra info', 42);

    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(callArg).toContain('param0=extra info');
    expect(callArg).toContain('param1=42');
  });
});
