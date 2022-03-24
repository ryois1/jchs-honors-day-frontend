const { GitRevisionPlugin } = require('git-revision-webpack-plugin')

module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'JCHS Awards Portal'
                return args
            })
        config.plugin('define').tap(args => {
            const gitRevisionPlugin = new GitRevisionPlugin()
            args[0]['process.env']['VUE_APP_COMMIT_HASH'] = JSON.stringify(gitRevisionPlugin.commithash())
            return args
        })
    },
    productionSourceMap: true,
}