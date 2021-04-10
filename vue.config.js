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
}