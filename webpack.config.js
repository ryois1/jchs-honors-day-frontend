const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
    configureWebpack: {
      plugins: [
        new SentryWebpackPlugin({
            token: process.env.SENTRY_AUTH_TOKEN,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            url: process.env.SENTRY_URL,
            project: process.env.SENTRY_PROJECT,
            include: "./dist",
            ignore: ["node_modules", "webpack.config.js"],
        }),
      ],
    },
};