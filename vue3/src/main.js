import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/assets/global.css' 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import  Axios  from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia';
const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(ElementPlus,{locale:zhCn})
app.use(Axios)
app.use(VueAxios)
app.use(pinia);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')
