import './css/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { keywordIconMap } from './utils/iconMap';

Object.values(keywordIconMap).forEach(icon => library.add(icon));

const app = createApp(App)

app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app')

