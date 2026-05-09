import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const LoginPage = () => import('@/pages/LoginPage.vue')
const RegisterPage = () => import('@/pages/RegisterPage.vue')
const HomePage = () => import('@/pages/HomePage.vue')
const NoteDetailPage = () => import('@/pages/NoteDetailPage.vue')
const NoteEditorPage = () => import('@/pages/NoteEditorPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/notes' },
    { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true, title: 'Sign In' } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true, title: 'Register' } },
    { path: '/notes', name: 'home', component: HomePage, meta: { requiresAuth: true, title: 'Home' } },
    { path: '/notes/new', name: 'note-create', component: NoteEditorPage, meta: { requiresAuth: true, title: 'Create Note' } },
    { path: '/notes/:id', name: 'note-detail', component: NoteDetailPage, meta: { requiresAuth: true, title: 'Note Detail' } },
    { path: '/notes/:id/edit', name: 'note-edit', component: NoteEditorPage, meta: { requiresAuth: true, title: 'Edit Note' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Not Found' } },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router
