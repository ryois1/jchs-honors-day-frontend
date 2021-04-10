const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
    configureWebpack: {
      plugins: [
        new SentryWebpackPlugin({
            token: 'f7ee8a9a999a11eb8edd0242ac120014',
            authToken: 'f7ee8a9a999a11eb8edd0242ac120014',
            org: "jcs",
            url: "https://sentry.ryois.net/",
            debug: true,
            project: "honors-day-frontend",
            include: "./dist",
            ignore: ["node_modules", "webpack.config.js"],
        }),
      ],
    },
  };