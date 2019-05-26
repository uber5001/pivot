const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge.multiple(
  [
    {mode: 'production'},
    {mode: 'production'}
  ],
  common
)