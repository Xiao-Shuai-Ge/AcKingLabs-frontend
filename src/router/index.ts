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
        path: '/diary/:id',
        name: 'DiaryDetail',
        component: () => import('../views/PostPage.vue')
    },
    {
        path: '/diary/create',
        name: 'DiaryCreate',
        component: () => import('../views/DiaryCreatePage.vue')
    },
    {
        path: '/learn',
        name: 'Learn',
        component: () => import('../views/LearnPage.vue')
    },
    {
        path: '/learn/:id',
        name: 'LearnDetail',
        component: () => import('../views/PostPage.vue')
    },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router