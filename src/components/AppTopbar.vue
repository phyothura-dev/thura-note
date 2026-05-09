<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppBreadcrumb from './AppBreadcrumb.vue';
import ThemeToggleButton from './ThemeToggleButton.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

function signOut() {
  authStore.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="mb-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <AppBreadcrumb />

      <div class="flex items-center gap-2">
        <ThemeToggleButton size="sm" class="rounded-lg px-3" />
        <Button v-if="authStore.isAuthenticated" variant="destructive" size="sm" @click="signOut">Sign Out</Button>
      </div>
    </div>
    <Separator class="mt-3" />
  </div>
</template>
