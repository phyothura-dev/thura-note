<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Eye, EyeOff, NotebookPen } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useAuthActions } from '@/composables/useAuthActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { errorMessage, registerMutation } = useAuthActions()

const form = reactive({
  username: '',
  password: '',
  password_confirm: '',
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

async function onSubmit() {
  errorMessage.value = ''
  await registerMutation.mutateAsync({
    username: form.username,
    password: form.password,
    password_confirm: form.password_confirm,
  })
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_38%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_24%,transparent),transparent_34%)]" />

    <section class="relative w-full max-w-md rounded-lg border border-border/60 bg-card/84 p-8 shadow-2xl backdrop-blur-xl">
      <div class="mb-8 flex items-center gap-4">
        <div class="rounded-lg bg-primary/18 p-3 text-primary shadow-sm">
          <NotebookPen class="size-5 md:size-7" />
        </div>
        <div class="flex-1">
          <h1 class="text-xl md:text-2xl text-primary font-bold leading-tight">Create account</h1>
        </div>
      </div>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input id="username" v-model="form.username" required type="text" placeholder="Username" autocomplete="username" class="rounded-lg" />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <div class="relative">
            <Input
              id="password"
              v-model="form.password"
              required
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="rounded-lg pr-11"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="password-confirm">Confirm password</Label>
          <div class="relative">
            <Input
              id="password-confirm"
              v-model="form.password_confirm"
              required
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm password"
              class="rounded-lg pr-11"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <EyeOff v-if="showConfirmPassword" class="size-4" />
              <Eye v-else class="size-4" />
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

        <Button class="h-12 w-full rounded-lg text-base font-semibold" type="submit" :disabled="registerMutation.isPending.value">
          {{ registerMutation.isPending.value ? 'Creating account...' : 'Register' }}
        </Button>

        <p class="text-center text-sm text-muted-foreground">
          Already have an account?
          <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary hover:underline">Login</RouterLink>
        </p>
      </form>
    </section>
  </div>
</template>
