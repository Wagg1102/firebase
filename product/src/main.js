import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

createApp(App)
.use(router)
.use(ElementPlus)
.mount('#app')
