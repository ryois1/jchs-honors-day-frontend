const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "jchs-honors-day",
        project: "jchs-honors-day-frontend",
        include: ".",
        ignore: ["node_modules", "webpack.config.js"],
      }),
    ],
  },
};