process.env.NODE_ENV = 'development';
const mainConfig = require('./webpack.main.config.js');
const rendererConfig = require('./webpack.renderer.config.js');

const path = require('path')
const { spawn } = require('child_process');

const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require('electron');

const { parseArgs, getPort } = require("./utils.js");


const dev = {
    isRestart:false,
    electronProcess:null,
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
        const electronProcess = spawn(electron,args);
        //'--inspect=5858',
        electronProcess.stdout.on('data', data => {
            if(this.isRestart){
                this.isRestart = false
            }
            this.electronLog(data, 'blue')
        });
        electronProcess.stderr.on('data', data => {
            if(this.isRestart){
                this.isRestart = false
            }
            this.electronLog(data, 'red')
        });
        electronProcess.on('close', () => {
            if (!this.isRestart) process.exit()
        });
        this.electronProcess = electronProcess;

    },
    // 编译主进程
    startMain(env,argv){
        // 设置Babel环境变量
        process.env.BABEL_ENV = "main"; 

        let config = mainConfig(env,argv);
        const compiler = webpack(config);
        return new Promise((resolve, reject)=>{
            compiler.watch({},(err,stats)=>{
                let electronProcess = this.electronProcess;
                if(err){
                    console.log(chalk.red(err.toString()));
                    reject(err)
                    return;
                }
                console.log(stats.toString({
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                }));
                console.log(`${chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white('主进程编译完毕')}\n`);
                
                // 重启electron
                if(electronProcess && electronProcess.pid){
                    this.isRestart = true;
                    process.kill(electronProcess.pid)
                    this.electronProcess = null;
                    this.startElectron();
                }

                resolve(true);
            })
        })
    },
    // 编译渲染进程
    async startRenderer(env,argv){
        // 设置Babel环境变量
        process.env.BABEL_ENV = "renderer";

        let config = rendererConfig(env,argv);
        let devServerConfig = config.devServer;
        
        devServerConfig.port = await getPort(devServerConfig.port||8080);
        const host = devServerConfig.host || "localhost";
        const port = devServerConfig.port

        WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
        const compiler = webpack(config);
        const server = new WebpackDevServer(compiler, devServerConfig);
        server.listen(port, () => {
            if (err) return;
            console.log(`Listening at http://${host}:${port}`);
        });

        return new Promise((resolve, reject) =>{
            compiler.hooks.done.tap('done', stats => {
                const compilation = stats.compilation
                Object.keys(compilation.assets).forEach(key => {
                    console.log(chalk.blue(key));
                });
                compilation.warnings.forEach(key => {
                    console.log(chalk.yellow(key));
                });
                compilation.errors.forEach(key => {
                    console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
                });
                console.log(`${chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white('渲染进程编译完毕')}\n`);
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
        // 启动调试
        this.runDev(argv.env,argv);
    },
};

dev.run();