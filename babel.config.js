module.exports ={
    "env":{
        "main":{
            "presets":[
                ["@babel/preset-env",{
                    // "modules": false,
                    "targets":{
                        "node":true,
                        "electron":"11.1.1"
                    }
                }],                
                ["@babel/preset-typescript",{
                    "allExtensions":true
                }]
            ],
        },
        "renderer":{
            "presets":[
                ["@babel/preset-env",{
                    // "modules": false
                }],                
                ["@babel/preset-typescript",{
                    "isTSX":true,
                    "allExtensions":true
                }]
            ],
            "plugins":[
                ["@vue/babel-plugin-jsx",{
                    "optimize":true
                }],
                ["@babel/plugin-transform-runtime",{
                    "useESModules":true,
                    "corejs":{
                        "version": 3,
                        "proposals": true
                    }
                }]
            ]
        }
    },
    "plugins":[
        "@babel/plugin-proposal-class-properties"
    ]

}