function reload() {
  const main = require('./App');
  const initialize = main.default || main;

  Promise.resolve(initialize()).then(app => {
    app.cleanup();
    app.init();
  });
}

reload();

if (module.hot) {
  module.hot.accept('./App', reload);
}
