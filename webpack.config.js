const path = require('path');
const HappyPack = require('happypack');
// const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'src/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'UtilTools'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // 排除也就是不转换node_modules下面的.js文件
        exclude: /(node_modules|bower_components)/,
        // 加载器  webpack2需要loader写完整 不能写babel 要写 bable-loader
        use: [{ loader: 'babel-loader' }]
        // 使用多进程加快速度
        // use: 'happypack/loader?id=happyBabel'
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      // 如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }]
      // // 共享进程池
      // threadPool: happyThreadPool,
      // // 允许 HappyPack 输出日志
      // verbose: true
    }),
    new BundleAnalyzerPlugin()
  ]

};
