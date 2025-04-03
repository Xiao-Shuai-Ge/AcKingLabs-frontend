# 开发笔记

---
### 2025/4/3

使用 vue3+vite 搭建初始化项目。

并用router加入多页面路由:

1. 安装依赖：`npm install vue-router@4`
2. 在 `src` 目录下创建 `router`文件夹，并创建 `index.js` 或 `index.ts` 文件用于配置路由。

```javascript
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage
    },
    // 添加更多路由...
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

3. 在 `main.js` 中导入 `router` 并挂载到 `app` 上。

```javascript
createApp(App)
    .use(router)
    .mount('#app')
```

然后导入 `tailwindcss` 组件库，这是个可以让 class 参数快速生成 css 样式的工具。

1. 安装依赖：`npm install -D tailwindcss@3 postcss autoprefixer` (我也不知道为什么tailwindcss4我配置不了)
2. 初始化配置 `npx tailwindcss init -p`
3. 在 `tailwind.config.js` 配置渲染的文件类型。
```javascript
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
4. 写一个全局 style 样式文件 `tailwind.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---