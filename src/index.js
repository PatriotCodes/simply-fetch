function ExtendedFetch(route, options, method, config) {
  this.config = config;
  this.timeout = undefined;
  this.exceedsTimeout = false;

  const httpMethods = {
    GET: { bodyLess: true },
    HEAD: { bodyLess: true },
    OPTIONS: { bodyLess: true },
    DELETE: { bodyLess: true },
    CONNECT: { bodyLess: true },
    POST: { bodyLess: false },
    PUT: { bodyLess: false },
    PATCH: { bodyLess: false },
  };

  const buildRoute = function(route) {
    return route[0] === '/'
      ? `${window.location.protocol}//${window.location.host}${route}`
      : !new RegExp('^http').test(route)
      ? `${config.BASE_URL}${route}`
      : route;
  };

  const buildOptions = function(method, { headers, body, ...options }) {
    return {
      method: method,
      headers: {
        ...(config.TOKEN() && {
          Authorization: `${config.AUTH_TYPE ? `${config.AUTH_TYPE} ` : ''}${config.TOKEN()}`,
        }),
        ...(!httpMethods[method].bodyLess && {
          'Content-Type':
            headers && headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
        }),
        ...headers,
      },
      ...(body && {
        body:
          headers &&
          headers['Content-Type'] &&
          !headers['Content-Type'].includes('application/json')
            ? body
            : JSON.stringify(body),
      }),
      ...options,
    };
  };

  this.controller = new AbortController();
  this.nativeFetch = window.fetch(
    buildRoute(route),
    buildOptions(method, { ...options, signal: this.controller.signal }),
  );

  this.then = function(callback) {
    this.nativeFetch = new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        this.exceedsTimeout = true;
        reject(new Error(`Timeout of ${this.config.TIMEOUT}ms exceeded`));
      }, this.config.TIMEOUT);
      this.nativeFetch
        .then(response => {
          clearTimeout(this.timeout);
          if (!this.exceedsTimeout) {
            if (!response.ok) {
              reject(response);
            } else {
              resolve(callback(response));
            }
          }
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            reject(error);
          }
        });
    });
    return this;
  };

  this.catch = function(callback) {
    this.nativeFetch = this.nativeFetch.catch(error => {
      if (error.name !== 'AbortError') {
        return callback(error);
      }
    });
    return this;
  };

  this.finally = function(callback) {
    this.nativeFetch = this.nativeFetch.finally(callback);
    return this;
  };

  this.abort = function() {
    clearTimeout(this.timeout);
    this.controller.abort();
  };
}

const fetchz = {
  config: {
    BASE_URL: '/',
    TOKEN: () => undefined,
    TIMEOUT: 5000,
    AUTH_TYPE: '',
  },
};

fetchz.get = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'GET', fetchz.config);
};

fetchz.post = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'POST', fetchz.config);
};

fetchz.put = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'PUT', fetchz.config);
};

fetchz.delete = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'DELETE', fetchz.config);
};

fetchz.patch = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'PATCH', fetchz.config);
};

export default fetchz;
