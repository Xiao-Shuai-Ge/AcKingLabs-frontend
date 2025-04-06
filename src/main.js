import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import { createPinia } from "pinia";
const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
