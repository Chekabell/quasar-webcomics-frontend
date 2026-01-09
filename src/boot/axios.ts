import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import type { ApiError } from 'src/types/api';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) =>{
    return Promise.reject(new Error(error))
  }
)

api.interceptors.response.use(
  (response) => {
    // Обрабатываем успешные ответы
    return response
  },
   (error) =>{
    let userMessage = "";
    if (error.response) {
      userMessage = error.response.data.message;
    } else if (error.request) {
      userMessage = 'Network error - please check your connection';
    } else{
      userMessage = 'Unexpected error';
    }

    const enchancedError : ApiError = {
      ...error,
      userMessage: userMessage
    }

    return Promise.reject(enchancedError);
  }
)

export { api };
