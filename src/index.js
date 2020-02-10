const caller = {
  config: {
    BASE_URL: '',
    TOKEN: () => {},
    TIMEOUT: 5000,
  },
};

caller.call = async function(route, options, method, body) {

  const buildRoute = function(route) {
    const isUrlRegExp = new RegExp('^http');
    return route[0] === '/'
      ? `${window.location.protocol}//${window.location.host}${route}`
      : !isUrlRegExp.test(route)
        ? `${caller.config.BASE_URL}${route}`
        : route;
  };

  const buildOptions = function(method, body, { headers, ...options }) {
    return {
      method: method,
      headers: {
        ...(caller.config.TOKEN() && {
          Authorization: `${caller.config.TOKEN()}`,
        }),
        'Content-Type':
          headers && headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
        ...headers,
      },
      ...(body && {
        body:
          headers && headers['Content-Type'] && !headers['Content-Type'].includes('application/json')
            ? body
            : JSON.stringify(body),
      }),
      ...options,
    };
  };

  // TODO: should be tested
  const timeoutFetch = function(url, options) {
    return Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout of ${caller.config.TIMEOUT}ms exceeded`)),
          caller.config.TIMEOUT,
        ),
      ),
    ]);
  };

  const checkResponseOk = function(response) {
    if (!response.ok) throw new Error(response.statusText);
  };

  try {
    const response = await timeoutFetch(
      buildRoute(route, options),
      buildOptions(method, body, options),
    );
    checkResponseOk(response);
    const responseContentType = response.headers.get('Content-Type');
    return responseContentType && responseContentType.includes('json')
      ? await response.json()
      : await response.text();
  } catch (error) {
    throw error;
  }
};

caller.get = async function(route, options) {
  return await caller.call(route, options, 'GET');
};

caller.post = async function(route, body, options) {
  return await caller.call(route, options, 'POST', body);
};

caller.put = async function(route, body, options) {
  return await caller.call(route, options, 'PUT', body);
};

caller.delete = async function(route, options) {
  return await caller.call(route, options, 'DELETE');
};

caller.patch = async function(route, body, options) {
  return await caller.call(route, options, 'PATCH', body);
};

module.exports = caller;
