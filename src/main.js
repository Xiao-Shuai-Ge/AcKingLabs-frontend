import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import { createPinia } from "pinia";
const pinia = createPinia();

//import websocket from 'vue-native-websocket'
//import websocket from 'vue-socket.io-next'


import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import hljs from 'highlight.js';

// 引入 KaTeX 和数学公式插件
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import katex from 'katex'
import 'katex/dist/katex.css' // 引入 KaTeX 的样式

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import {config} from "@/config.js";

const KatexPlugin = createKatexPlugin({ katex });

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(KatexPlugin)

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(KatexPlugin)

const app = createApp(App)

app.use(VMdEditor)
    .use(VMdPreview)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    //.use(websocket, config.BACKEND_URL+"/ws?token="+"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzcyI6ImF0b2tlbiIsImV4cCI6MTc1MjA0MzU4NSwicm9sZSI6NCwidXNlcmlkIjoiMTkwODkyNzI5NTQ2MTAwMzI2NCIsInVzZXJuYW1lIjoi5bCP5biF5ZOlIn0.mRdw_2dTl363k6TU8V-6e3s5vUCXoH23DOe5CdiUqd0")


app.mount('#app')