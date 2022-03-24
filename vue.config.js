const GitRevisionPlugin = require('git-revision-webpack-plugin');
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'JCHS Awards Portal'
            return args
        })
        config.plugin('define').tap(args => {
            args[0]['process.env']['VUE_PKG_VER'] = String(version);
            return args
        })
        config.plugin('define').tap(args => {
            const gitRevisionPlugin = new GitRevisionPlugin()
            args[0]['process.env']['VUE_APP_VER'] = JSON.stringify(gitRevisionPlugin.version())
            return args
        })
    },
    productionSourceMap: true,
}