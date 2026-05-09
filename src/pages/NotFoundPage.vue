<script setup lang="ts">
import { ArrowLeft, Home, LogIn } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 md:px-6">
    <section class="w-full rounded-lg border border-border/70 bg-card/85 p-8 text-center shadow-lg backdrop-blur-sm md:p-10">
      <p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">404 Error</p>
      <h1 class="text-4xl font-extrabold tracking-tight md:text-5xl">Page not found</h1>
      <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        The page you are trying to reach does not exist or may have been moved.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button class="rounded-lg" @click="router.push({ name: authStore.isAuthenticated ? 'home' : 'login' })">
          <Home class="size-4" />
          {{ authStore.isAuthenticated ? 'Go to Home' : 'Go to Login' }}
        </Button>
        <Button variant="outline" class="rounded-lg" @click="router.back()">
          <ArrowLeft class="size-4" />
          Go Back
        </Button>
        <Button
          v-if="!authStore.isAuthenticated"
          variant="ghost"
          class="rounded-lg"
          @click="router.push({ name: 'login' })"
        >
          <LogIn class="size-4" />
          Sign In
        </Button>
      </div>
    </section>
  </main>
</template>
