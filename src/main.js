import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import { createPinia } from "pinia";
const pinia = createPinia();

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


const KatexPlugin = createKatexPlugin({ katex });

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
VMdEditor.use(KatexPlugin)

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(KatexPlugin)

createApp(App)
    .use(VMdEditor)
    .use(VMdPreview)
    .use(router)
    .use(pinia)
    .mount('#app')
