const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0

module.exports = {
  'chainWebpack': config => {
    config.plugin('define').tap(args => {
      const gitRevisionPlugin = new GitRevisionPlugin()
      args[0]['process.env']['VUE_APP_COMMIT_HASH'] = JSON.stringify(gitRevisionPlugin.commithash())
      return args
    })
  },
  configureWebpack: {
    plugins: [
      new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "jchs-honors-day",
        project: "jchs-honors-day-frontend",
        include: ".",
        ignore: ["node_modules", "webpack.config.js"],
      }),
      new webpack.DefinePlugin({
        'process.env': {
            PACKAGE_VERSION: '"' + version + '"'
        }
    })
    ],
  },
};