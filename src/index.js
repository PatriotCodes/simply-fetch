class Caller {
  static isUrlRegExp = new RegExp("^http");

  static config = {
    BASE_URL: "",
    TOKEN: () => {}
  };

  static buildRoute = route =>
    !this.isUrlRegExp.test(route) ? `${this.config.BASE_URL}${route}` : route;

  static buildOptions = (method, body, { headers, ...options }) => ({
    method: method,
    headers: {
      ...(this.config.TOKEN() && { Authorization: `${this.config.TOKEN()}` }),
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
  });

  static checkResponseOk(response) {
    if (!response.ok) throw new Error(response.statusText);
  }

  static async get(route, options) {
    return await this.call(route, options, "GET");
  }

  static async post(route, body, options) {
    return await this.call(route, options, "POST", body);
  }

  static async call(route, options, method, body) {
    try {
      const response = await fetch(
        this.buildRoute(route, options),
        this.buildOptions(method, body, options)
      );
      this.checkResponseOk(response);
      const responseContentType = response.headers.get("Content-Type");
      return responseContentType && responseContentType.includes("json")
        ? await response.json()
        : await response.text();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Caller;
