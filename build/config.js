
const BASE_PATH=process.cwd();
// 资源路径
const assetsPath = {
    out_images:"Style/Images/",
    out_font:"Style/Font/",
    out_js:"JS/",
    out_dll:"dll/",
    out_css:"Style/Css/",
    template:`${BASE_PATH}/public/pages/`,
    "node_modules":`node_modules`
}

// web 资源路径
const WEB_PATHS={
    base:BASE_PATH,
    entry:`${BASE_PATH}/src/`,
    output:`${BASE_PATH}/dist/`,
    ...assetsPath
}

//  electron renderer 资源路径
const RENDERER_PATHS={
    base:BASE_PATH,
    entry:`${BASE_PATH}/src/renderer/`,
    output:`${BASE_PATH}/app/renderer/`,
    ...assetsPath
}

// electron main 资源路径
const MAIN_PATHS={
    base:BASE_PATH,
    entry:`${BASE_PATH}/src/main/`,
    output:`${BASE_PATH}/app/main/`,
    ...assetsPath,
    out_js:""
}


// 开发环境配置
const devServer = {
    // 启动gzip压缩
    compress:true,
    historyApiFallback:true,
    disableHostCheck:true,
    publicPath:"/",
    stats: {
        colors: true,
    },
    overlay: true,
    hot: true,
    hotOnly: true,
    // watchContentBase:true,
    inline:true,
    open:false
}

// web config
const webConfig = {
    target:"web",
    paths:WEB_PATHS,
    devServer:{
        ...devServer,
        // host:"0.0.0.0",
        proxy:[
            {
                context: ['/api/**'],
                target:"http://localhost",
                changeOrigin: true,
                secure: false
            }
        ]
    },
    resolves:{
        alias:{
            "@": WEB_PATHS.entry,
            "@JS": "@/JS",
            "@Style": "@/Style",
            "@Store": "@/Store",
            "@Views": "@/Views",
            "@Components": "@/Components",
            "@Router": "@/Router",
        },
        modules: [
            WEB_PATHS.entry, 
            WEB_PATHS.node_modules
        ],
        extensions: ['.ts', '.tsx', '.js', '.json',".vue"]
    },
    hash:".[contenthash:5]",
    // hash:"",
    commonCssLink:[],
    pages:{
        main:{
            // page 的入口
            entry:`${WEB_PATHS.entry}main.tsx`,
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title:"主页",
            // 在 dist/index.html 的输出
            filename:"index.html",
            // 模板来源
            template:`${WEB_PATHS.template}Index.ejs`
            // 提取出来的通用 chunk 和 vendor chunk。
            // chunks:[]
        }
    }
}
// electron renderer config
const rendererConfig = {
    target:"electron-renderer",
    paths:RENDERER_PATHS,
    devServer:{
        ...devServer,
    },
    resolves:{
        alias:{
            "@": RENDERER_PATHS.entry,
            "@JS": "@/JS",
            "@Style": "@/Style",
            "@Store": "@/Store",
            "@Views": "@/Views",
            "@Components": "@/Components",
            "@Router": "@/Router",
        },
        modules: [
            RENDERER_PATHS.entry,RENDERER_PATHS.node_modules
        ],
        extensions: ['.ts', '.tsx', '.js', '.json',".vue"]
    },
    pages:{
        main:{
            entry:`${RENDERER_PATHS.entry}main.tsx`,
            title:"主页",
            filename:"index.html",
            template:`${RENDERER_PATHS.template}Index.ejs`
        }
    },
    hash:".[contenthash:5]",
    commonCssLink:[]
}
// electron main config
const mainConfig = {
    target:"electron-main",
    entry:`${MAIN_PATHS.entry}main.ts`,
    paths:MAIN_PATHS,
    resolves:{
        alias:{
            "@": MAIN_PATHS.entry,
            "@JS": "@/JS",
            "@Style": "@/Style",
            "@Store": "@/Store",
            "@Views": "@/Views",
            "@Components": "@/Components",
            "@Router": "@/Router",
        },
        modules: [
            MAIN_PATHS.entry,MAIN_PATHS.node_modules
        ],
        extensions: ['.ts', '.tsx', '.js', '.json',".vue"]
    },
}


const config = {
    web: webConfig,
    renderer: rendererConfig,
    main: mainConfig,
    node: {}
}


module.exports = config