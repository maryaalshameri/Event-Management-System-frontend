# vue-project

This template will help you get started developing with **Vue 3** in **Vite**.

## Recommended IDE Setup

* [VSCode](https://code.visualstudio.com/)
* [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable **Vetur** for better compatibility).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

---

## Project Setup

```sh
# Create new Vite project
npm create vite@latest my-project
cd my-project

# Install dependencies
npm install
```

### Install TailwindCSS

```sh
npm install tailwindcss @tailwindcss/vite
```

### Install Additional Libraries

```sh
npm install qrcode.vue html2canvas jspdf
npm install @fortawesome/fontawesome-free
npm install xlsx
npm install vue-toastification
npm install qrcode
```

---

## Compile and Hot-Reload for Development

```sh
npm run dev
```

## Compile and Minify for Production

```sh
npm run build
```

---

## Main Entry Setup

`main.js`

```js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './services/api'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.config.globalProperties.$api = api
app.mount('#app')
```

---

## Using Chart.js with Vue 3

To work with charts in Vue 3 you can use **Chart.js** directly or with `vue-chartjs`.

1. Install:

```sh
npm install chart.js vue-chartjs
```

2. Import the required Chart.js modules in your component (for example: Line Chart):

   * Title
   * Tooltip
   * Legend
   * LineElement
   * CategoryScale
   * LinearScale
   * PointElement
   * **Filler** (required if you want to use area under the line)

3. Register them with Chart.js before rendering the chart.

4. Use `<LineChart>` or custom chart component with `vue-chartjs`.

---

## API Documentation (Overview)

Your Vue project communicates with a backend API (Laravel in this case).

### Authentication

* **Register (`POST /register`)** – create a new user account.
* **Login (`POST /login`)** – authenticate user and get token.
* **Logout (`POST /logout`)** – invalidate the current token.

### User Management

* **Get Current User (`GET /me`)** – return details of the authenticated user.

### Token Handling

* Token saved in **localStorage**.
* All requests use `Authorization: Bearer <token>`.
* On `401 Unauthorized`, user is logged out automatically.

---

## API Examples

### 1. Register

**Request**

```json
POST /register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login

**Request**

```json
POST /login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Get Current User

**Request**

```http
GET /me
Authorization: Bearer <token>
```

**Response**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

### 4. Logout

**Request**

```http
POST /logout
Authorization: Bearer <token>
```

**Response**

```json
{
  "message": "Successfully logged out"
}
```

---

## Notes

* Update `baseURL` in `src/services/api.js` with your backend API endpoint.
* Call `store.dispatch('initialize')` on app startup to reload user session if token exists.
* Use Chart.js plugins like **Filler** for area charts.

---
