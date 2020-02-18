global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    protocol: 'http:',
    host: 'test.com',
  },
});

require('jest-fetch-mock').enableMocks();
