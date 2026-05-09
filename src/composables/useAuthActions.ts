import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { loginApi, registerApi } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

export function useAuthActions() {
  const router = useRouter();
  const authStore = useAuthStore();
  const errorMessage = ref('');

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      authStore.setSession(data.token, data.user);
      toast.success(`Welcome back, ${data.user.username}`);
      router.push({ name: 'home' });
    },
    onError: () => {
      errorMessage.value = 'Login failed. Please check username and password.';
      toast.error('Login failed. Please check username and password.');
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success('Account created. Please log in.');
      router.push({ name: 'login' });
    },
    onError: () => {
      errorMessage.value = 'Register failed. Please try another username.';
      toast.error('Register failed. Please try another username.');
    },
  });

  const isPending = computed(() => loginMutation.isPending.value);

  return {
    errorMessage,
    loginMutation,
    registerMutation,
    isPending,
  };
}
