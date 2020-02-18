# fetchz

[![Build Status](https://travis-ci.org/patriotcodes/fetchz.svg?branch=master)](https://travis-ci.org/patriotcodes/fetchz) 
[![Coverage Status](https://coveralls.io/repos/github/PatriotCodes/fetchz/badge.svg?branch=master)](https://coveralls.io/github/PatriotCodes/fetchz?branch=master)

A lightweight wrapper over fetch api to make fetch calls easier without boilerplate code! 
Abortable fetch with timeout, internal response.ok handling, configuration and utility functions for http methods.

## Features

1. Check for response.ok errors
2. Each request has an abort method
3. Timeout setting for requests
4. Settings config for BaseUrl and Authentication token
5. Util functions for HTTP request methods

## Installing

```npm
npm install --save fetchz
```

## Example Usage

#### Import:
```js
import fetchz from 'fetchz';
```

#### Setting configuration:
```js
// set baseUrl (default is application origin)
fetchz.config.BASE_URL = 'https://my-app.com/'

// set request timeout in ms (default is 5000ms)
fetchz.config.TIMEOUT = 7000;

// set token get method
fetchz.config.TOKEN = () => localStorage.getItem('jwt');

// set authorization type
fetchz.config.AUTH_TYPE = 'Basic';
```

#### Example POST request:
```js
// JSON.stringify will be automatically used on body if no Content-Type header is specified
try {
  const request = fetchz.post('post-route', {
    cache: 'no-cache',
    body: {
      foo: 'bar'
    }
  }).then(response => {
    response.json().then(json => {
      const data = json;
    })
  })
  // catch block will also return any non 200 response errors as well as timeout errors
} catch (error) {
  console.error(error);
}

// Aborting request
request.abort();
```

#### Passing route:
```js
// request to base url / route
fetchz.get('route');

// request to app origin / route
fetchz.get('/route');

// request to route
fetchz.get('https://api/route');
```

## Work in Progress:

1. Instance creation
2. ~~Cancel method~~
3. Response/request interceptors
