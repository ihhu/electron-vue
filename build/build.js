process.env.NODE_ENV = 'development';
const path = require('path')
const { spawn } = require('child_process');

const chalk = require("chalk");
const webpack = require("webpack");

const { parseArgs } = require("./utils.js");


const dev = {
    startElectron(){

    },
    // 编译主进程
    startMain(env,argv){
        argv.devServer = false;

        // 设置Babel环境变量
        process.env.BABEL_ENV = "main"; 
        const mainConfig = require('./webpack.main.config.js');

        let config = mainConfig(env,argv);
        const compiler = webpack(config);

        return new Promise((resolve, reject)=>{
            compiler.run((err,stats)=>{
                if(err){
                    console.log(chalk.red(err.toString()));
                    reject(err)
                    return;
                }
                console.log(stats.toString({
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                }));
                console.log(`${chalk.green(`\ntime：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white('主进程编译完毕')}\n`);
                resolve(true);
            })
        })
    },
    // 编译渲染进程
    async startRenderer(env,argv){
        // 设置Babel环境变量
        process.env.BABEL_ENV = "renderer";
        const rendererConfig = require('./webpack.renderer.config.js');

        let config = rendererConfig(env,argv);
        const compiler = webpack(config);

        return new Promise((resolve, reject) =>{
            compiler.run((err,stats)=>{
                if(err){
                    console.log(chalk.red(err.toString()));
                    reject(err)
                    return;
                }
                console.log(stats.toString({
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                }));
                console.log(`${chalk.green(`\ntime：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white('渲染进程编译完毕')}\n`);
                resolve(true);
            })
        });
    },
    // 启动调试
    async runDev(env,argv){
        try{
            await this.startRenderer(env,argv);
            await this.startMain(env,argv);
            this.startElectron();
        }catch(err){
            console.log(chalk.red(err.toString()));
            process.exit();
        }
    },
    run(){
        let argv = parseArgs(process.argv);
        console.log(argv);
        // 启动调试
        this.runDev(argv.env,argv);
    },
};

dev.run();