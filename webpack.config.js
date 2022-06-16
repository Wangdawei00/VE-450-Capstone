const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: ["regenerator-runtime/runtime.js", "./ASD/js/main.jsx"],
    account: "./ASD/js/account.jsx"
  },
  output: {
    path: path.join(__dirname, '/ASD/static/js/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        // Test for js or jsx files
        test: /\.jsx?$/,
        // Exclude external modules from loader tests
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
