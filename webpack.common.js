module.exports = {
  entry: './src/index.js',
  output: {
    assetModuleFilename: 'img/[name].[hash].[ext]',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
};
