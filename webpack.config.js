const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = {
  plugins: [
    new SentryCliPlugin({
      include: '.',
      ignore: ['node_modules', 'webpack.config.js'],
      url: 'https://sentry.ryois.net/',
      authToken: 'f7ee8a9a999a11eb8edd0242ac120014',
      token: 'f7ee8a9a999a11eb8edd0242ac120014',
      org: 'jcs',
      project: 'honors-day-frontend',
      debug: true
    }),
  ],
};