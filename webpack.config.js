const HtmlWebpackPlugin = require('html-webpack-plugin');

const LOADERS = [
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  },
  {
    test: /\.css$/i,
    use: ["style-loader", {
      loader: "css-loader",
      options: {
        modules: true, 
      },
    }],
  },
];

const PLUGINS = [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  })
];

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: LOADERS,
  },
  plugins: PLUGINS,
  devServer: {
    port: 3002
  }
}
