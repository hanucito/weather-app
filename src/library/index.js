class Library {
  getLocalIP() {
    return new Promise(resolve => {
      if (this.localIP) return resolve(this.localIP);
      let address = prompt('Use Google IP?', '172.217.15.100');
      if (address) return resolve(address);
      resolve('');
    })
  }
  getApi() {
    return new Promise(resolve => {
      if (localStorage.getItem('rest-api') !== null) return resolve(localStorage.getItem('rest-api'));
      let restApi = prompt('api?', 'http://localhost');
      if (restApi) return resolve(restApi);
    })
  }
  fetch(path) {
    let tryApi; 
    return this.getApi()
      .then(api => {
        tryApi = api;
        return fetch(`${api}${path}`);
      })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('rest-api', tryApi);
        return json;
      })
  }
  getWeatherCurrent (args) {
    if (args.query) return this.fetch(`/current/${args.query}`)
    return this.fetch(`/current/${args.coords.lat}/${args.coords.lon}`);
  }
  getWeatherForecast (args) {
    if (args.query) return this.fetch(`/forecast/${args.query}`)
    return this.fetch(`/forecast/${args.coords.lat}/${args.coords.lon}`);
  }
  getLocationFromIP () {
    return this.getLocalIP()
      .then(ip => this.fetch(`/location?ip=${ip}`));
  }
}

export default Library;