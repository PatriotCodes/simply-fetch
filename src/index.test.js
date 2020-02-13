import fetchz from './index';

describe('lib tests', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

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

  it('should append auth token if specified', async () => {
    await fetchz.get('route');
    expect(fetch.mock.calls[0][1].headers.Authorization).toEqual('Basic token');
  });

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

  // it('should throw error if not completed within timeout', async () => {
  //   fetchz.config.TIMEOUT = 50;
  //   fetch.mockResponseOnce(
  //     () => new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 100)),
  //   );
  //   await expect(fetchz.get('route').then()).rejects.toThrow();
  // });

  it('should make get request with proper header', async () => {
    await fetchz.get('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('GET');
  });

  // it('should call fetchz call method when get called', async () => {
  //   let callMock = jest.spyOn(fetchz, 'call');
  //   callMock.mockImplementation(() => true);
  //   await fetchz.get('/route');
  //   expect(callMock.mock.calls.length).toBe(1);
  //   callMock.mockRestore();
  // });

  it('should make post request with proper request method', async () => {
    await fetchz.post('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('POST');
  });

  // it('should call fetchz call method when post called', async () => {
  //   let callMock = jest.spyOn(fetchz, 'call');
  //   callMock.mockImplementation(() => true);
  //   await fetchz.post('/route');
  //   expect(callMock.mock.calls.length).toBe(1);
  //   callMock.mockRestore();
  // });

  it('should make put request with proper request method', async () => {
    await fetchz.put('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('PUT');
  });

  // it('should call fetchz call method when put called', async () => {
  //   let callMock = jest.spyOn(fetchz, 'call');
  //   callMock.mockImplementation(() => true);
  //   await fetchz.put('/route');
  //   expect(callMock.mock.calls.length).toBe(1);
  //   callMock.mockRestore();
  // });

  it('should make delete request with proper request method', async () => {
    await fetchz.delete('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('DELETE');
  });

  // it('should call fetchz call method when delete called', async () => {
  //   let callMock = jest.spyOn(fetchz, 'call');
  //   callMock.mockImplementation(() => true);
  //   await fetchz.delete('/route');
  //   expect(callMock.mock.calls.length).toBe(1);
  //   callMock.mockRestore();
  // });

  it('should make patch request with proper request method', async () => {
    await fetchz.patch('/route');
    expect(fetch.mock.calls[0][1].method).toEqual('PATCH');
  });

  // it('should call fetchz call method when patch called', async () => {
  //   let callMock = jest.spyOn(fetchz, 'call');
  //   callMock.mockImplementation(() => true);
  //   await fetchz.patch('/route');
  //   expect(callMock.mock.calls.length).toBe(1);
  //   callMock.mockRestore();
  // });
});
