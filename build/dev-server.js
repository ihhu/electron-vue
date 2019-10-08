const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const webpackConfig = require('./dev.js');
const options = {
    compress:true,
    proxy:{
    },
    stats: {
        colors: true,
    },
    hot: true,
    inline:true
};
const devServerOptions = Object.assign({}, webpackConfig.devServer, options);
webpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, devServerOptions);

server.listen(5000, '0.0.0.0', () => {
    console.log('Starting server on http://localhost:5000')
});