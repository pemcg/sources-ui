/* global require, module */

module.exports = {
    ...require('./base.webpack.config'),
    ...require('./test.webpack.plugins.js')
};
