import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import './style.css'
import router from "./router"
import { createPinia } from 'pinia'
import SvgIcon from "./components/SvgIcon.vue";

const pinia = createPinia()
const app = createApp(App);
app.use(Antd)
app.use(pinia)
app.use(router);
app.component("SvgIcon", SvgIcon);
app.mount('#app');