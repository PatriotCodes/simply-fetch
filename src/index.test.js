import fetchz from './index';

describe('lib tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  // CONFIG
  it('default config TOKEN should return undefined', () => {
    expect(fetchz.config.TOKEN()).toEqual(undefined);
  });

  it('should set config properly', () => {
    const newConfig = {
      BASE_URL: 'http://base-url/',
      TOKEN: () => 'token',
      TIMEOUT: 20000,
      AUTH_TYPE: 'Basic',
    };
    fetchz.config.BASE_URL = newConfig.BASE_URL;
    fetchz.config.TOKEN = newConfig.TOKEN;
    fetchz.config.TIMEOUT = newConfig.TIMEOUT;
    fetchz.config.AUTH_TYPE = newConfig.AUTH_TYPE;
    expect(fetchz.config).toEqual(newConfig);
  });

  // AUTH
  it('should append auth token if specified', async () => {
    await fetchz.get('route');
    expect(fetch.mock.calls[0][1].headers.Authorization).toEqual('Basic token');
  });

  // ROUTE BUILD
  it('build route should return baseUrl appended route for non-http route', async () => {
    await fetchz.get('route');
    expect(fetch.mock.calls[0][0]).toEqual('http://base-url/route');
  });

  test.each([['https://www'], ['http://']])(
    'build route should return route is it is http/https appended',
    async route => {
      await fetchz.get(route);
      expect(fetch.mock.calls[0][0]).toEqual(route);
    },
  );

  it('build route should fallback to location.origin base url when passed with a /', async () => {
    await fetchz.get('/route');
    expect(fetch.mock.calls[0][0]).toEqual('http://test.com/route');
  });

  // TIMEOUT
  it('should throw error if not completed within timeout', async () => {
    fetchz.config.TIMEOUT = 50;
    fetch.mockResponseOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 100)),
    );
    expect(fetchz.get('route').then(x => {})).rejects.toThrow();
  });

  // UTILITY FUNCTIONS
  it('should make get request with proper header', async () => {
    await fetchz.get('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('GET');
  });

  it('should make post request with proper request method', async () => {
    await fetchz.post('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('POST');
  });

  it('should make put request with proper request method', async () => {
    await fetchz.put('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('PUT');
  });

  it('should make delete request with proper request method', async () => {
    await fetchz.delete('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
  });

  it('should make patch request with proper request method', async () => {
    await fetchz.patch('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('PATCH');
  });
});
