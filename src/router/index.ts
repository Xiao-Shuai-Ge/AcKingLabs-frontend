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
        path: '/diary/:id/edit',
        name: 'DiaryEdit',
        component: () => import('../views/PostEditPage.vue')
    },
    {
        path: '/diary/create',
        name: 'DiaryCreate',
        component: () => import('../views/CreatePage.vue')
    },
    {
        path: '/learn',
        name: 'Learn',
        component: () => import('../views/LearnPage.vue')
    },
    {
        path: '/learn/create',
        name: 'LearnCreate',
        component: () => import('../views/CreatePage.vue')
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
    },
    {
        path: '/message',
        name: 'Message',
        component: () => import('../views/MessagePage.vue')
    },
    {
        path: '/more/ulearning',
        name: 'Ulearning',
        component: () => import('../views/Ulearning.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router