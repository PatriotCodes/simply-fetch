const caller = {
  isUrlRegExp: new RegExp("^http"),
  config: {
    BASE_URL: "",
    TOKEN: () => {}
  }
};

caller.buildRoute = function(route) {
  return !caller.isUrlRegExp.test(route)
    ? `${caller.config.BASE_URL}${route}`
    : route;
};

caller.buildOptions = function(method, body, { headers, ...options }) {
  return {
    method: method,
    headers: {
      ...(caller.config.TOKEN() && {
        Authorization: `${caller.config.TOKEN()}`
      }),
      ...headers
    },
    ...(body && {
      body:
        headers &&
        headers["Content-Type"] &&
        !headers["Content-Type"].includes("application/json")
          ? body
          : JSON.stringify(body)
    }),
    ...options
  };
};

caller.checkResponseOk = function(response) {
  if (!response.ok) throw new Error(response.statusText);
};

caller.call = async function(route, options, method, body) {
  try {
    const response = await fetch(
      caller.buildRoute(route, options),
      caller.buildOptions(method, body, options)
    );
    this.checkResponseOk(response);
    const responseContentType = response.headers.get("Content-Type");
    return responseContentType && responseContentType.includes("json")
      ? await response.json()
      : await response.text();
  } catch (error) {
    throw error;
  }
};

caller.get = async function(route, options) {
  return await this.call(route, options, "GET");
};

caller.post = async function(route, body, options) {
  return await this.call(route, options, "POST", body);
};

module.exports = caller;
