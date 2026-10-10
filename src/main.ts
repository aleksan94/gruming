import { createApp } from 'vue'
import App from './App.vue'
import './style.scss'
import { loadCatalog } from './data/catalog'

loadCatalog()
createApp(App).mount('#app')
