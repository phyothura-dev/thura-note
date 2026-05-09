import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/types/auth";

const TOKEN_KEY = "developer-note-token";
const USER_KEY = "developer-note-user";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem(USER_KEY) ?? "null"),
  );

  const isAuthenticated = computed(() => Boolean(token.value));

  function setSession(nextToken: string, nextUser: User) {
    token.value = nextToken;
    user.value = nextUser;
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    token,
    user,
    isAuthenticated,
    setSession,
    logout,
  };
});
