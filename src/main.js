import './assets/main.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './services/api';
import '@fortawesome/fontawesome-free/css/all.css'
// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js'
// ChartJS.register(
//   Title,
//   Tooltip,
//   Legend,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Filler
// )
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toast);
app.config.globalProperties.$api = api;
app.mount('#app');           // آخر شيء اعمل mount
