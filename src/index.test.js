import caller from './index';

test.each([['https//www', true], ['http://www', true], ['/www', false]])(
  'isUrlRegExp should resolve correctly', (route, expected) => {
    expect(caller.isUrlRegExp.test(route)).toEqual(expected);
  },
);

it('should set config properly', () => {
  const newConfig = {
    BASE_URL: 'http://base-url',
    TOKEN: () => 'token',
  };
  caller.config.BASE_URL = newConfig.BASE_URL;
  caller.config.TOKEN = newConfig.TOKEN;
  expect(caller.config).toEqual(newConfig);
});

it('build route should return baseUrl appended route for non-http route', () => {
  expect(caller.buildRoute('/route')).toEqual('http://base-url/route');
});

test.each([['https://www'], ['http://']])(
  'build route should return route is it is http/https appended', route => {
    expect(caller.buildRoute(route)).toEqual(route);
  },
);
