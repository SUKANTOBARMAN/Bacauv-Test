import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()
  
  // Add the persisted state plugin with custom storage key
  pinia.use(piniaPluginPersistedstate)
  
  return pinia
})