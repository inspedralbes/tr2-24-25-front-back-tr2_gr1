import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './router'
import './assets/index.css'
import './assets/base.css'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: 'none'
});
app.use(VCalendar, {});
app.mount('#app')
