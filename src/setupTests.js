global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    protocol: 'http:',
    host: 'test.com',
  },
});

global.fetch = require('jest-fetch-mock');
