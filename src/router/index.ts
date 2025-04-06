// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue')
    },
    {
        path: '/diary',
        name: 'Diary',
        component: () => import('../views/DiaryPage.vue')
    },
    {
        path: '/learn',
        name: 'Learn',
        component: () => import('../views/LearnPage.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router