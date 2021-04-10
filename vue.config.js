module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'JCHS Awards Portal'
                return args
            })
    },
    productionSourceMap: true,
}