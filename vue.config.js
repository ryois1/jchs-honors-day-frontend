const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'JCHS Honors Day'
                return args
            })
    },
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
          new SentryWebpackPlugin({
            authToken: '0b01f77c997111ebbb6a1e308719b7af',
            org: "jchs-nl",
            project: "jchs-honors-day-frontend",
            include: ".",
            ignore: ["node_modules", "vue.config.js"],
          }),
        ],
    },
}