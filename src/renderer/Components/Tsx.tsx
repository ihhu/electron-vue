import { ref, defineComponent } from "vue";
import common from "@/components/common.vue"


export default defineComponent({
    component:{
        common
    },
    setup(){
        let compStr = ref<string>("this is tsx view setup");
        let App = ()=>(
            <div class="tsx">
                <common/>
                <h2>{compStr.value}</h2>    
            </div>
        )
        return ()=>(
            <App/>
        )
    }
});