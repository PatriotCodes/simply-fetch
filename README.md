# fetchz

![](./coverage/badge-statements.svg) ![](./coverage/badge-functions.svg) ![](./coverage/badge-lines.svg)

A very basic and lightweight wrapper over fetch api to make fetch calls easier without boilerplate code!

## Features

1. Check for response.ok errors
2. Timeout setting for requests
3. Settings config for BaseUrl and Authentication token
4. Util functions for HTTP request methods

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

#### Make POST request:
```js
// JSON.stringify will be automatically used on body if no Content-Type header is specified
try {
  const request = await fetchz.post('post-route', {
    foo: 'bar'
  }, {
    cache: 'no-cache'
  });
  const data = request.json();
  // catch block will also return any non 200 response errors as well as timeout errors
} catch (error) {
  console.error(error);
}
```

#### Passing route:
```js
// request to base url / route
fetchz.get('route');

// request to app origin / route
fetchz.get('/route');

// request to route
fetch.get('https://api/route');
```

## Work in Progress:

1. Instance creation
2. Cancel method
3. Response/request interceptors
