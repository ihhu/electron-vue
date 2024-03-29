const BASE_PATH = process.cwd();

// ======================================
// ======================================
// basePath
const basePath = {
  base: BASE_PATH,
  out_images: "assets/images/",
  out_font: "assets/font/",
  out_js: "js/",
  out_dll: "dll/",
  out_css: "assets/css/",
  public: `${BASE_PATH}/public/`,
  node_modules: `node_modules`,
};
// web paths
const webPaths = {
  ...basePath,
  entry: `${BASE_PATH}/src/`,
  output: `${BASE_PATH}/dist/`,
  page: `${BASE_PATH}/src/pages/`,
};
//  electron renderer paths
const rendererPaths = {
  ...basePath,
  entry: `${BASE_PATH}/src/renderer/`,
  output: `${BASE_PATH}/app/renderer/`,
  page: `${BASE_PATH}/src/renderer/pages/`,
};
// electron main paths
const mainPaths = {
  ...basePath,
  entry: `${BASE_PATH}/src/main/`,
  output: `${BASE_PATH}/app/main/`,
  out_js: "",
};

// ======================================
// ======================================
// dev server config
const devServer = {
  historyApiFallback:true,
  client:{
    overlay: true,
    progress:true
  },
  hot: true,
  open:false,
  devMiddleware:{
    publicPath:'/'
  },
  allowedHosts:'all'
};

// ======================================
// ======================================
// web config
const webConfig = {
  target: "web",
  paths: webPaths,
  devServer: {
    ...devServer,
    // host:"0.0.0.0",
    proxy: [
      {
        context: ["/api/**"],
        target: "http://localhost",
        changeOrigin: true,
        secure: false,
      },
    ],
  },
  resolves: {
    alias: {
      "@": `${basePath.base}/src`,
      "@main": "@/main",
      "@renderer": "@/renderer",
      "@assets": "@/assets",
    },
    modules: [basePath.base, webPaths.node_modules],
    extensions: [".ts", ".tsx", ".js", ".json", ".vue"],
  },
  hash: ".[contenthash:5]",
  commonCssLink: [],
  pages: {
    main: {
      entry: `${webPaths.page}index/main.tsx`,
      title: "主页",
      filename: "index.html",
      template: `${webPaths.entry}index.ejs`,
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks:[]
    },
  },
};
// electron renderer config
const rendererConfig = {
  target: "electron-renderer",
  paths: rendererPaths,
  devServer: {
    ...devServer,
  },
  resolves: {
    alias: {
      "@": `${basePath.base}/src`,
      "@main": "@/main",
      "@renderer": "@/renderer",
      "@assets": "@renderer/assets",
    },
    modules: [basePath.base, rendererPaths.node_modules],
    extensions: [".ts", ".tsx", ".js", ".json", ".vue"],
  },
  pages: {
    main: {
      title: "主页",
      filename: "index.html",
      entry: `${rendererPaths.page}/index/main.tsx`,
      template: `${rendererPaths.entry}index.ejs`,
    },
  },
  hash: "",
  commonCssLink: [],
};
// electron main config
const mainConfig = {
  target: "electron-main",
  entry: `${mainPaths.entry}main.ts`,
  paths: mainPaths,
  resolves: {
    alias: {
      "@": `${basePath.base}/src`,
      "@main": "@/main",
      "@renderer": "@/renderer",
    },
    modules: [basePath.base, mainPaths.node_modules],
    extensions: [".ts", ".tsx", ".js", ".json", ".vue"],
  },
};

module.exports = {
  web: webConfig,
  renderer: rendererConfig,
  main: mainConfig,
  node: {},
};
