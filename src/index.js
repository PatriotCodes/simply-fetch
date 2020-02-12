const fetchz = {
  config: {
    BASE_URL: '/',
    TOKEN: () => undefined,
    TIMEOUT: 5000,
    AUTH_TYPE: '',
  },
};

fetchz.call = async function(route, options, method, body) {
  const buildRoute = function(route) {
    const isUrlRegExp = new RegExp('^http');
    return route[0] === '/'
      ? `${window.location.protocol}//${window.location.host}${route}`
      : !isUrlRegExp.test(route)
      ? `${fetchz.config.BASE_URL}${route}`
      : route;
  };

  const buildOptions = function(method, body, { headers, ...options }) {
    return {
      method: method,
      headers: {
        ...(fetchz.config.TOKEN() && {
          Authorization: `${fetchz.config.TOKEN()}`,
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

  const timeoutFetch = function(url, options) {
    return Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout of ${fetchz.config.TIMEOUT}ms exceeded`)),
          fetchz.config.TIMEOUT,
        ),
      ),
    ]);
  };

  const checkResponseOk = function(response) {
    if (!response.ok) throw response;
  };

  try {
    const response = await timeoutFetch(
      buildRoute(route, options),
      buildOptions(method, body, options),
    );
    checkResponseOk(response);
    return response;
  } catch (error) {
    throw error;
  }
};

fetchz.get = async function(route, options = {}) {
  return await fetchz.call(route, options, 'GET');
};

fetchz.post = async function(route, body = {}, options = {}) {
  return await fetchz.call(route, options, 'POST', body);
};

fetchz.put = async function(route, body = {}, options = {}) {
  return await fetchz.call(route, options, 'PUT', body);
};

fetchz.delete = async function(route, options = {}) {
  return await fetchz.call(route, options, 'DELETE');
};

fetchz.patch = async function(route, body = {}, options = {}) {
  return await fetchz.call(route, options, 'PATCH', body);
};

export default fetchz;
