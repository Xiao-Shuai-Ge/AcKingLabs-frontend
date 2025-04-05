import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";



createApp(App)
    .use(router)
    .mount('#app')
