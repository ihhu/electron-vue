process.env.NODE_ENV = 'development';
const path = require('path')
const { spawn } = require('child_process');

const chalk = require("chalk");
const webpack = require("webpack");

const { parseArgs } = require("./utils.js");


const dev = {
    argv:{},
    startElectron(){

    },
    pack(type){
        const argv = this.argv;
        argv.devServer = false;

        // 设置Babel环境变量
        process.env.BABEL_ENV = type; 
        const fnWebpackConfig = require(`./webpack.${type}.config.js`);

        const config = fnWebpackConfig(argv.env,argv);
        const compiler = webpack(config);

        return new Promise((resolve, reject) =>{
            compiler.run((err,stats)=>{
                if(err){
                    reject(err.stack || err)
                    return;
                }
                if(stats.hasErrors()){
                    reject(stats.toString({
                        chunks: false,
                        colors: true 
                    }))
                    return;
                }
                console.log(stats.toString({
                    chunks: false,
                    colors: true
                }));
                console.log(`${chalk.green(`\ntime：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white(`${type} 进程编译完毕`)}\n`);
                resolve(true);
            })
        })
    },
    // 编译主进程
    startMain(){
        return this.pack("main");
    },
    // 编译渲染进程
    startRenderer(){
        return this.pack("renderer");
    },
    // 启动调试
    async runDev(){
        try{
            await this.startRenderer();
            await this.startMain();
            this.startElectron();
        }catch(err){
            console.log(chalk.red(err));
            process.exit();
        }
    },
    run(){
        let argv = parseArgs(process.argv);
        this.argv = {...this.argv,...argv};
        console.log(this.argv);
        // 启动调试
        this.runDev();
    },
};

dev.run();