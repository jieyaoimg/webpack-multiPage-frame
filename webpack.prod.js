const webpack = require('webpack');
const merge = require('webpack-merge'); // webpack-merge插件用于合并多个webpack配置文件
const common = require('./webpack.common.js'); // 引入公共配置文件

module.exports = merge(common, { // webpack-merge插件合并webpack配置文件写法,注意common没有引号！！！
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common', //公共模块的name属性值，可以通过[name]调用
      filename: 'static/js/[name]-[chunkhash].js',    //公共模块的路径和名称。注意：如果开发和生产环境的webpack配置文件没有分开，那么在打包前必须把热更新new webpack.HotModuleReplacementPlugin()注释掉，否则这里的chunkhash会报错
      minChunks: 3 //设置至少多少个入口文件都包含的代码块才能写入公共模块中，这里Infinity代表无穷大，表示必须每个入口文件都有的代码块才能写入
    }),
    new webpack.HashedModuleIdsPlugin({}) //根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境,作用是优化浏览器缓存
  ]
})


