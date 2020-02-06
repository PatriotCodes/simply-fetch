import Caller from './index';

test.each([['https//www', true], ['http://www', true], ['/www', false]])(
  'isUrlRegExp should resolve correctly', (route, expected) => {
    expect(Caller.isUrlRegExp.test(route)).toBe(expected);
  },
);
