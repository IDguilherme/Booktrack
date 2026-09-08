import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import './assets/styles/variables.css'
import './assets/styles/global.css'
import './assets/styles/components.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
