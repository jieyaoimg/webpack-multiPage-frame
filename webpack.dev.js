const webpack = require('webpack');
const merge = require('webpack-merge'); // webpack-merge插件用于合并多个webpack配置文件
const common = require('./webpack.common.js'); // 引入公共配置文件

module.exports =merge(common, { // webpack-merge插件合并webpack配置文件写法,注意common没有引号！！！
  devtool: 'source-map',  //此选项不要写入生产环境中，否则会导致生成的common代码块变大，具体原因不明。
  devServer: { //虚拟web服务器设置选项
    contentBase: './dist', //设置虚拟web服务器的跟目录
    hot: true, // 启用webpack 的模块热更新特性,注意热更新只是调试的时候所见即所得，并没有更新出口文件里面的内容，所以项目开发好了后还是需要手动npm run build进行打包操作的
    compress: true, // //启用gzip 压缩
    inline: true, // 默认为true，在inline和iframe两种模式之间切换，inline模式意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台；iframe模式会在通知栏下面使用 <iframe> 标签，包含了关于构建的消息。推荐使用默认。
    index: 'index.html' //自定义首页，默认为index.html
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //调用webpack的内置热更新插件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common', //公共模块的name属性值，可以通过[name]调用
      filename: 'static/js/[name]-[hash].js',    //公共模块的路径和名称。注意：这里使用的是hash而不是chunkhash，因为chunkhash和热更新插件new webpack.HotModuleReplacementPlugin()冲突，不能同时存在。
      minChunks: 3 //设置至少多少个入口文件都包含的代码块才能写入公共模块中，这里Infinity代表无穷大，表示必须每个入口文件都有的代码块才能写入
    })
  ]
})


