class ExtendedFetch {
  constructor(route, options, method, config, body) {
    this.config = config;
    this.timeout = undefined;
    this.exceedsTimeout = false;
    const buildRoute = function(route) {
      return route[0] === '/'
        ? `${window.location.protocol}//${window.location.host}${route}`
        : !new RegExp('^http').test(route)
          ? `${config.BASE_URL}${route}`
          : route;
    };

    // TODO: Protect user from passing signal:
    const buildOptions = function(method, body, { headers, ...options }) {
      return {
        method: method,
        headers: {
          ...(config.TOKEN() && {
            Authorization: `${config.AUTH_TYPE ? `${config.AUTH_TYPE} ` : ''}${config.TOKEN()}`,
          }),
          'Content-Type':
            headers && headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
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
      buildOptions(method, body, { ...options, signal: this.controller.signal }),
    );
  }

  then(callback) {
    this.nativeFetch = new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        this.exceedsTimeout = true;
        reject(new Error(`Timeout of ${this.config.TIMEOUT}ms exceeded`));
      }, this.config.TIMEOUT);
      this.nativeFetch.then(response => {
        clearTimeout(this.timeout);
        if (!this.exceedsTimeout) {
          if (!response.ok) {
            reject(response);
          } else {
            resolve(callback(response));
          }
        }
      });
    });
    return this;
  }

  catch(callback) {
    this.nativeFetch = this.nativeFetch.catch(error => {
      if (error.name !== 'AbortError') {
        return callback(error);
      }
    });
    return this;
  }

  finally(callback) {
    this.nativeFetch = this.nativeFetch.finally(callback);
    return this;
  }

  // TODO: work on error catch
  abort() {
    clearTimeout(this.timeout);
    this.controller.abort();
  }
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

fetchz.post = function(route, body = {}, options = {}) {
  return new ExtendedFetch(route, options, 'POST', fetchz.config, body);
};

fetchz.put = function(route, body = {}, options = {}) {
  return new ExtendedFetch(route, options, 'PUT', fetchz.config, body);
};

fetchz.delete = function(route, options = {}) {
  return new ExtendedFetch(route, options, 'DELETE', fetchz.config);
};

fetchz.patch = function(route, body = {}, options = {}) {
  return new ExtendedFetch(route, options, 'PATCH', fetchz.config, body);
};

export default fetchz;
