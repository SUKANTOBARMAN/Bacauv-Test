import { boot } from 'quasar/wrappers'
import axios from 'axios'
import {useUserStore} from "stores/userStore";

const api = axios.create({
  baseURL: process.env.DEV
    ? process.env.DEV_API_URL
    : process.env.BUILD_API_URL,
});
// 


export default boot(({ app }) => {
  // const store = useStore(); // Initialize the store
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const store = useUserStore();
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      if (store.isAuthenticated) {
        config.headers.Authorization  = `Bearer ${localStorage.getItem('accessToken')}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api }

