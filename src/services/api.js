// src/services/api.js
import axios from 'axios'

// إنشاء نسخة مخصصة من axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // تغيير هذا حسب عنوان Laravel الخاص بك
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// إضافة معالج للطلب (interceptor) لإضافة token المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// إضافة معالج للاستجابة (interceptor) للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إذا كان الخطأ غير مصرح به، قم بتسجيل الخروج
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api