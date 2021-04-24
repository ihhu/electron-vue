# electron-vue
`electron` 软件开发工程模版

- 采用双 `package.json` 结构管理依赖
- 使用 `webpack5` + `electron-builder` 打包编译项目。
- `main` 和 `renderer` 进程使用 `es6` + `vue3` 开发，可根据需求修改成 `react`
- 支持HMR更新 `main` 和 `renderer` 进程文件 
- 支持使用 `typescript` 语言开发
- `@babel/preset-env` 自动匹配转换 `main` 进程、 `renderer` 进程代码



### 快速开始
`git clone` 或 下载模版，进入模版**执行命令** 
```javascript
// 使用 yarn 命令请参照 yarn 文档修改

// 安装依赖
npm install

// `TypeScript`类型检测
npm run tsc

// 启动开发环境
// 添加 --hot参数 可hmr更新主进程代码
npm run dev 

// 编译打包 win平台 exe
npm run build

// mac, linux平台打包需要在 package.json 文件添加相关配置
// 详细配置文档见：https://www.electron.build/configuration/configuration
```



### 目录说明
- `build` webpack config 配置目录
- `src` webpack编译输入目录，源代码
- `app` webpack编译输出目录 electron-builder 打包输入目录
- `dist` electron-builder 打包输出目录
- `typings` .d.ts目录

