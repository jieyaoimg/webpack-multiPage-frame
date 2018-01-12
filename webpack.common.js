const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //此插件打包的时候会自动生成html，并且自动引用了生成的js/css文件。
const CleanWebpack = require('clean-webpack-plugin'); //此插件打包前会清理指定文件夹内容
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //将所有的入口 chunk中引用的 *.css，移动到各自独立分离的 CSS 文件（注意：一个入口生成一个css）

var viewArr=[ // view文件夹下的模板都写在这里，其他文件夹里的一些组件/第三方插件的模需要你自己去一个个new HtmlWebpackPlugin({})，因为它们不在同一个目录。
  'index',
  'list',
  'about'
]
let pluginsArr=[ //webpack的插件配置
  new webpack.ProvidePlugin({ // 设置全局范围内自动加载的模块，而不必到处 import 或 require 
    $: 'jquery', // $可以全局使用，并且其值为'jquery'输出的内容。
    jquery: 'jquery'
  }),
  new webpack.LoaderOptionsPlugin({ // 帮助从 webpack 1 迁移至 webpack 2的插件，将来可能会被移除
    minimize: true
  }),
  new webpack.optimize.UglifyJsPlugin({ // 压缩代码
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new CleanWebpack(['dist']), //慎用，在构建打包的时候会先自动清理指定文件夹
  new ExtractTextPlugin({ // 将所有的入口 chunk中引用的 *.css，移动到各自独立分离的 CSS 文件（注意：一个入口生成一个css）    
    filename:'static/css/[name]-[contenthash].css', // 设置生成css文件的路径和名称， [name]是入口的名称，[contenthash]是生成的css文件的hash
    allChunks: true  // 在某些情况下，不设置此项，打包后生成的代码运行时会报错
  }),
  new HtmlWebpackPlugin({  // view文件夹下的模板已经用HtmlWebpackPlugin批量处理了，这里，需要手动对其他文件夹里的一些组件/第三方插件等的模板这样一个个new,
    filename: './dialog.html',
    template: path.resolve(__dirname, './src/js/components/dialog/tmpl/dialog.html'),
    inject: true,
    hash: true,
    chunks: [], // 设置webpack生成的哪些js/css等文件可以引入html中，不配置就会引入所有生成的js/css等文件，这里配置了一个空的，表示生成的js/css等文件都不引入到html中
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  })
]
viewArr.forEach((getPage)=>{  // 批量把viewArr数组里面的模板生成html页面
  const HtmlPlugin=new HtmlWebpackPlugin({ //该插件把HTML或者EJS模板（也可以通过loader指定别的模板）生成一个HTML5文件，通过选项filename设置html生成的路径和名称，并且会自动引入打包生成的js和css文件，当然也可以指定具体引入哪几个。多个模板需要new多个html-webpack-plugin对象
    filename: `./${getPage}.html`, // 生成的html存放路径和名称，相对于出口path
    template: path.resolve(__dirname, `./src/view/${getPage}.html`), // html模板路径
    inject: true, // js插入的位置，true/'head'/'body'/false
    hash: true, // 为静态资源生成hash值
    chunks: ['common', getPage], // 设置哪些生成的js/css等文件可以引入html中，不配置就会引入所有生成的js/css等文件
    minify: { // 压缩HTML文件
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: false // 删除空白符与换行符
    }
  })
  pluginsArr.push(HtmlPlugin)
})

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/js/page/index.js'), //入口1
    list: path.resolve(__dirname, './src/js/page/list.js'), //入口2
    about: path.resolve(__dirname, './src/js/page/about.js') //入口3
  },
  output: {
    path: path.resolve(__dirname, 'dist/'), //出口路径
    publicPath: '/', //生成的js/css/img等资源会以publicPath路径为标准加载到html中。
    filename: 'static/js/[name]-[chunkhash].js', //出口文件名,有几个入口文件就会解析出几个出口文件，[name]会自动解析成每个入口文件的属性名,[chunkhash]是hash值。
    chunkFilename: 'static/js/chunk-[id]-[chunkhash].js' //设置非入口文件的名称，前提是如果你的项目中使用了基于CommonJS的异步加载语句：require.ensure()。如果没有使用那么此句无效。
  },
  // externals: {
  //       jquery: 'jquery' //设置jquery不被打包
  // },
  module: {
    rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader', //如果css没有被单独提取出来，就接着应用这个loader（既对style类型的CSS应用style-loader)，如果已经提取出来就忽略此句
          use: ['css-loader','postcss-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader','postcss-loader']
        }),
      }, //对.less格式的文件依次应用postcss-loader，less-loader，css-loader，style-loader
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader','postcss-loader']
        }),
      }, //对.scss格式的文件依次应用postcss-loader，sass-loader，css-loader，style-loader
      {
        test: /\.js$/,
        use: { //use可以是字符串或者数组或者对象类型，此处是对象格式
          loader: 'babel-loader',
          options: {}
        }
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: 'html-loader', // 由于webpack本身无法自动提取打包html模板中的url文件（如img标签等），如果想打包这些图片，必须在入口文件中一个一个把图片require进来，这样做显然不够优雅，此时我们可以通过html-loader来完成这些操作——把模板中的图片require进来。之后url-loader或file-loader就可以像处理别的文件一样处理这些require进来的图片。
          options: {
            attrs: ['img:src', 'img:data-src'] // 设置html模板里的哪些标签属性里的url会被html-loader解析打包
          }
        }]
      },
      {
        test: /\.(jpg|gif|png)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 4096, // 图片小于4K会被转成base64
            name: 'static/images/[hash].[ext]' // 设置路径和文件名，[ext]是对应文件的扩展名，[hash]是内容的hash值
          }
        }]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          name: 'static/font/[hash].[ext]' // 设置字体的路径和文件名，[hash]是内容的hash值
        }
      }
    ]
  },
  performance: { //如果资源大于多少时，会输出一个警告来通知你
    hints: false //关闭此功能
  },
  plugins: pluginsArr
}

