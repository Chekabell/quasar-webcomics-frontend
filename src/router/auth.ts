import type {
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import { useAuthStore } from 'src/stores/authStore';

export default function authMiddleware(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Если роут требует авторизации
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Перенаправляем на страницу авторизации
      return next({
        name: 'auth',
        query: { redirect: to.fullPath }
      });
    }
    return next();
  }
  return next();
}
