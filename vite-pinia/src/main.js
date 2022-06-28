import { createPinia } from '../src/pinia'
import { createApp } from 'vue'
import App from './App.vue'

// 原因就是一切从组件开始
const app = createApp(App)
const pinia = createPinia()
pinia.use(function(store){
    console.log(store)
    let local = localStorage.getItem(store.id+"PINIA_STATE");

    if(local){
        store.$state = JSON.parse(local)
    }

    store.$subscribe((state)=>{
        localStorage.setItem(store.id+"PINIA_STATE",JSON.stringify(state))
    })
})
app.use(pinia)
app.mount('#app')


// vuex


// 注册的插件 每个store都会应用一下

