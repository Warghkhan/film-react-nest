import { JsonLogger } from '../json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log in JSON format', () => {
    logger.log('Hello', { user: 'Alice' });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/"level":"log"/),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/"message":"Hello"/),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringMatching(/"user":"Alice"/),
    );
  });
});
