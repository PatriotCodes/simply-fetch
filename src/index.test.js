import caller from './index';

global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    protocol: 'http:',
    host: 'test.com',
  },
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

// it('build route should return baseUrl appended route for non-http route', () => {
//   expect(caller.buildRoute('route')).toEqual('http://base-url/route');
// });
//
// test.each([['https://www'], ['http://']])(
//   'build route should return route is it is http/https appended',
//   route => {
//     expect(caller.buildRoute(route)).toEqual(route);
//   },
// );
//
// it('build route should fallback to location.origin base url when passed with a /', () => {
//   expect(caller.buildRoute('/get')).toEqual('http://test.com/get');
// });
