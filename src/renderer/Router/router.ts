import { createRouter, createWebHashHistory } from "vue-router";

import Common from "@/components/Common.vue";
// import a from "@Views/a.vue";
const a = ()=>import(/* webpackChunkName:"a" */"@/components/A.vue");
const b = ()=>import(/* webpackChunkName:"b" */"@/components/B.vue");
const tsx = ()=>import(/* webpackChunkName:"tsx" */"@/components/Tsx.tsx");
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
            component:a,
        },
        {
            path:"/b",
            component:b,
        },
        {
            path:"/tsx",
            component:tsx,
        }
    ]
})

export default router;