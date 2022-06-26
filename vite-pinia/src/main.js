import { createPinia } from '../src/pinia'
import { createApp } from 'vue'
import App from './App.vue'

// 原因就是一切从组件开始
const app = createApp(App)
app.use(createPinia())
app.mount('#app')


// vuex

