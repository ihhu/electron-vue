process.env.NODE_ENV = "development";
const path = require("path");
const { spawn } = require("child_process");

const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require("electron");

const HmrServer = require("./electron-main-hmr/HmrServer.js");

const { logger, parseArgs, getPort } = require("./utils.js");

const dev = {
  argv: {},
  electronProcess: null,
  devServerConfig: {},

  // 启动electron
  startElectron() {
    let args = ["--inspect=5858", path.join(process.cwd(), "app/main/main.js")];
    let options = {};
    const electronProcess = spawn(electron, args, options);
    //'--inspect=5858',
    electronProcess.stdout.on("data", data => {
      logger("Electron", data, chalk.blue);
    });
    electronProcess.stderr.on("data", data => {
      logger("Electron", data, chalk.red);
    });
    electronProcess.on("close", code => {
      if (!code) {
        process.exit();
      } else {
        code === 100 && this.relaunchElectron();
      }
    });
    this.electronProcess = electronProcess;
  },
  // 重启electron
  relaunchElectron() {
    let electronProcess = this.electronProcess;
    if (!electronProcess) {
      return;
    }
    // 重启electron
    if (electronProcess.pid) {
      try {
        process.kill(electronProcess.pid);
      } catch (error) {}
    }
    this.electronProcess = null;
    this.startElectron();
  },
  // 编译主进程
  startMain() {
    const { argv } = this;
    argv.devServer = {};
    ["host", "port"].forEach(key => {
      argv.devServer[key] = this.devServerConfig[key];
    });
    argv.devServer.protocol = this.devServerConfig["https"] ? "https" : "http";

    const fnWebpackConfig = require("./webpack.main.config.js");

    let config = fnWebpackConfig(argv.env, argv);
    const compiler = webpack(config);
    compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
      // 设置Babel环境变量
      process.env.BABEL_ENV = "main";
      this.invokeHmrServer("beforeCompile");
      done();
    });
    return new Promise((resolve, reject) => {
      compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(chalk.red(err.stack || err));
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          reject(
            stats.toString({
              chunks: false,
              colors: true,
            })
          );
          return;
        }

        console.log(
          stats.toString({
            chunks: false,
            colors: true,
          })
        );

        console.log(`${chalk.green(`\ntime：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white("main 进程编译完毕")}\n`);

        this.invokeHmrServer("built", stats);
        if (!argv.hot) {
          this.relaunchElectron();
        }

        if (resolve != null) {
          resolve(true);
          resolve = null;
          return;
        }
      });
    });
  },
  // 编译渲染进程
  async startRenderer() {
    const argv = this.argv;
    const fnWebpackConfig = require("./webpack.renderer.config.js");

    let config = fnWebpackConfig(argv.env, argv);
    let devServerConfig = config.devServer;

    devServerConfig.port = await getPort(devServerConfig.port || 8080);
    devServerConfig.host = devServerConfig.host || "localhost";

    this.devServerConfig = devServerConfig;
    const compiler = webpack(config);
    compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
      // 设置Babel环境变量
      process.env.BABEL_ENV = "renderer";
      done();
    });

    // WebpackDevServer.addDevServerEntrypoints(config, devServerConfig);
    const server = new WebpackDevServer( devServerConfig,compiler);
    server.start();

    return new Promise((resolve, reject) => {
      compiler.hooks.done.tap("done", stats => {
        const compilation = stats.compilation;
        compilation.warnings.forEach(key => {
          console.log(chalk.yellow(key));
        });
        compilation.errors.forEach(key => {
          console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
        });

        console.log(`${chalk.green(`\ntime：${(stats.endTime - stats.startTime) / 1000} s`)}\n${chalk.white("renderer 进程编译完毕")}\n`);

        resolve(true);
      });
    });
  },
  async startHmrServer() {
    const hmrServer = new HmrServer();
    await hmrServer.listen();
    hmrServer.ipc.on("error", error => {
      logger("Main", error, chalk.red);
    });
    this.hmrServer = hmrServer;
    this.argv.socketPath = hmrServer.socketPath;
  },
  invokeHmrServer(method, ...datas) {
    const { argv } = this;
    if (argv.hot && this.hmrServer) {
      this.hmrServer[method](...datas);
    }
  },
  // 启动调试
  async runDev() {
    const { argv } = this;
    try {
      await this.startRenderer();
      if (argv.hot) {
        await this.startHmrServer();
      }
      await this.startMain();
      this.startElectron();
    } catch (err) {
      console.log(chalk.red(err.stack || err.toString()));
      process.exit();
    }
  },

  run() {
    let argv = parseArgs(process.argv);
    this.argv = { ...this.argv, ...argv };

    this.runDev();
  },
};

dev.run();
