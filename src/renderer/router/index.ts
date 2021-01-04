import { createRouter, createWebHashHistory } from "vue-router";

import Common from "@renderer/components/Common.vue";
// import a from "@Views/a.vue";
const A = ()=>import(/* webpackChunkName:"a" */"@renderer/components/A.vue");
const B = ()=>import(/* webpackChunkName:"b" */"@renderer/components/B.vue");
const Tsx = ()=>import(/* webpackChunkName:"tsx" */"@renderer/components/Tsx.tsx");
// let c = 212;
// c = "fda";
const router = createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            path:"/",
            component:Common,
        },
        {
            path:"/a",
            component:A,
        },
        {
            path:"/b",
            component:B,
        },
        {
            path:"/tsx",
            component:Tsx,
        }
    ]
})

export default router;