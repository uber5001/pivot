const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge.multiple(
  [
    {mode: 'development'},
    {mode: 'development'}
  ],
  common
)