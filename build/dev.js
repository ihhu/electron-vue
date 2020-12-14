process.env.NODE_ENV = 'development';
const path = require('path')
const { spawn } = require('child_process');

const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require('electron');

const { parseArgs, getPort } = require("./utils.js");


const dev = {
    timer:null,
    isRelaunch:false,
    electronProcess:null,
    devServerConfig:{},
    // 美化Electron输出
    electronLog(data, color) {
        let log = '';
        data.toString().split(/\r?\n/).forEach(line => log += `\n${line}`);
        if (/[0-9A-z]+/.test(log)) {
            console.log(
                chalk[color].bold('┏ Electron -------------------') +
                log +
                chalk[color].bold('┗ ----------------------------')
            )
        }
    },
    // 启动electron
    startElectron(){
        let args = ['--inspect=5858',path.join(process.cwd(), 'app/main/main.js')]
        let options = {};
        const electronProcess = spawn(electron,args,options);
        //'--inspect=5858',
        electronProcess.stdout.on('data', data => {
            this.electronLog(data, 'blue')
        });
        electronProcess.stderr.on('data', data => {
            this.electronLog(data, 'red')
        });
        electronProcess.on('close', () => {
            if (!this.isRelaunch) process.exit()
        });
        this.electronProcess = electronProcess;

    },
    // 编译主进程
    startMain(env,argv){
        argv.devServer = {};
        ["host","port"].forEach(key=>{
            argv.devServer[key] = this.devServerConfig[key]
        })
        argv.devServer.protocol = this.devServerConfig["https"]?"https":"http";

        // 设置Babel环境变量
        process.env.BABEL_ENV = "main"; 
        const mainConfig = require('./webpack.main.config.js');

        let config = mainConfig(env,argv);
        const compiler = webpack(config);

        return new Promise((resolve, reject)=>{
            compiler.watch({},(err,stats)=>{
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
            })
            compiler.hooks.done.tap('done', stats => {
                let electronProcess = this.electronProcess;                
                // 重启electron
                if(electronProcess && electronProcess.pid){
                    this.isRelaunch = true;
                    process.kill(electronProcess.pid)
                    this.electronProcess = null;
                    this.startElectron();
                    
                    clearTimeout(this.timer)
                    this.timer = setTimeout(()=>{
                        this.isRelaunch = false;
                    },5000)
                }
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
        let devServerConfig = config.devServer;
        
        devServerConfig.port = await getPort(devServerConfig.port||8080);
        devServerConfig.host = devServerConfig.host || "localhost";
        const host = devServerConfig.host;
        const port = devServerConfig.port;
        this.devServerConfig = devServerConfig;
        WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
        const compiler = webpack(config);
        const server = new WebpackDevServer(compiler, devServerConfig);
        server.listen(port);

        return new Promise((resolve, reject) =>{
            compiler.hooks.done.tap('done', stats => {
                const compilation = stats.compilation;

                compilation.warnings.forEach(key => {
                    console.log(chalk.yellow(key));
                });
                compilation.errors.forEach(key => {
                    console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
                });
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