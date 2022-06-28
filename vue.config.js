const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  // 代理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn ',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
  pages: {
    index: {
      // 入口
      entry: 'src/main.js'
    }
  },
  lintOnSave: false  //关闭语法检查
})
