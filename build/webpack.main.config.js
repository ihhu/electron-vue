// 设置Babel环境变量
process.env.BABEL_ENV = "main"; 

const webpack = require('webpack');
const { merge }=require("webpack-merge");

const { CleanWebpackPlugin }=require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const config =  require("./config.js");
const { 
    target,
    entry,
    paths, 
    resolves, 
} = config.main



function webpackConfig(env,argv){   
    
    const IS_DEV = env.mode !== 'production';

    // webpack base config 
    const baseConf = {
        mode: IS_DEV ? "development" : "production",
        target,
        entry,
        output:{
            path:paths.output,
            chunkFilename:`${paths.out_js}[name].js`,
            filename:`${paths.out_js}[name].js`,
            publicPath:"/"
        },
        stats: {
            colors: true
        },
        optimization: {
            splitChunks: {
                maxInitialRequests:Infinity,
                automaticNameDelimiter: '.',
                cacheGroups:{
                    common: {  //公共模块 
                        name: "common",
                        chunks: "initial",  //入口处开始提取代码
                        minSize:0,      //代码最小多大，进行抽离
                        minChunks:3,    //代码复 2 次以上的抽离
                        priority:0
                    },
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: -10
                    }
                }
            }
        },
        module:{
            rules:[
                {
                    test:/\.(ts|js)x?$/,
                    exclude:[/node_modules/],
                    use:["thread-loader","babel-loader"]
                }
            ]
        },
        resolve:{
            ...resolves
        },
        plugins:[
            new webpack.DefinePlugin({
                IS_DEV
            })
        ]
    }
    // wepback development config
    const devConf = {
        devtool:false,
        watchOptions: {
            ignored: "node_modules/**"
        },
        plugins:[
        ]
    }
    // wepback production config
    const prodConf = {
        optimization:{
            minimize: true,
            minimizer:[
                new TerserPlugin({
                    // 启用/禁用提取注释 默认值：true
                    extractComments:false,
                    terserOptions:{
                        compress:{
                            hoist_vars:true,
                            reduce_vars:true,
                            hoist_funs:true,
                            dead_code:true
                        }
                    }
                })
            ]
        },
        plugins:[]

    }
    

    // 显示编译进度
    if(argv.progress){
        const isProfile = argv.progress === 'profile';
        baseConf.plugins.push(
            new webpack.ProgressPlugin({
                profile: isProfile
            })
        )
    }

    if(IS_DEV){        
        baseConf.plugins.push(
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns:["**/*"]
            })
        )
        // 定义 开发相关信息
        if(argv.devServer){
            devConf.plugins.push(
                new webpack.DefinePlugin({
                    DEV_SERVER:JSON.stringify(argv.devServer)
                })
            )
        }else{
            prodConf.plugins.push(
                new webpack.DefinePlugin({
                    DEV_SERVER:false
                })
            )
        }
        
        // 开启主进程hmr更新 定义socket地址
        if(argv.hot){
            devConf.plugins.push(
                new webpack.HotModuleReplacementPlugin(),
                new webpack.DefinePlugin({
                    HMR_SOCKET_PATH:JSON.stringify(argv.socketPath)
                })
            )
            baseConf.entry = [`${paths.base}/build/electron-main-hmr/index.js`,baseConf.entry]
        }
        
        return merge(baseConf, devConf);
    }else{
        if(!!argv.config){       
            baseConf.plugins.push(
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns:["**/*"]
                })
            )
        }else{
            baseConf.plugins.push(
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns:["**/*",`${paths.base}/dist/**`]
                })
            )
        }
        return merge(baseConf, prodConf);
    }
}

module.exports = webpackConfig;