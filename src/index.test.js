import caller from './index';

describe('lib tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should set config properly', () => {
    const newConfig = {
      BASE_URL: 'http://base-url/',
      TOKEN: () => 'token',
      TIMEOUT: 20000,
    };
    caller.config.BASE_URL = newConfig.BASE_URL;
    caller.config.TOKEN = newConfig.TOKEN;
    caller.config.TIMEOUT = newConfig.TIMEOUT;
    expect(caller.config).toEqual(newConfig);
  });

  it('build route should return baseUrl appended route for non-http route', async () => {
    await caller.get('route');
    expect(fetch.mock.calls[0][0]).toEqual('http://base-url/route');
  });

  test.each([['https://www'], ['http://']])(
    'build route should return route is it is http/https appended',
    async (route) => {
      await caller.get(route);
      expect(fetch.mock.calls[0][0]).toEqual(route);
    },
  );

  it('build route should fallback to location.origin base url when passed with a /', async () => {
    await caller.get('/route');
    expect(fetch.mock.calls[0][0]).toEqual('http://test.com/route');
  });

  it('should throw error if not completed within timeout', async () => {
    caller.config.TIMEOUT = 50;
    fetch.mockResponseOnce(
      () =>
        new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 100))
    );
    await expect(caller.get('route')).rejects.toThrow();
  });


});
