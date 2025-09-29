<template>
  <div class="login-container">
    <div class="login-card">
      <!-- شعار -->
      <div class="text-center mb-8">
        <div class="logo-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="login-title">تسجيل الدخول</h1>
        <p class="login-subtitle">أدخل بياناتك للوصول إلى حسابك</p>
        <p class="register-link">
          أو 
          <router-link to="/register">إنشاء حساب جديد</router-link>
        </p>
      </div>

      <!-- رسالة الخطأ -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- نموذج تسجيل الدخول -->
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- حقل البريد الإلكتروني -->
        <div class="form-group">
          <label for="email" class="form-label">البريد الإلكتروني</label>
          <div class="input-container">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              required 
              placeholder="أدخل بريدك الإلكتروني"
              :class="['form-input', errors.email ? 'error' : '']"
            >
          </div>
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <!-- حقل كلمة المرور -->
        <div class="form-group">
          <label for="password" class="form-label">كلمة المرور</label>
          <div class="input-container">
            <button 
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
            >
              <svg 
                v-if="showPassword" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg 
                v-else 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.83 3.83" />
              </svg>
            </button>
            
            <div class="input-icon left">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <input 
              id="password" 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              placeholder="أدخل كلمة المرور"
              :class="['form-input', errors.password ? 'error' : '']"
            >
          </div>
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <!-- تذكرني - نسيت كلمة المرور -->
        <div class="form-options">
          <div class="remember-me">
            <input 
              id="remember" 
              v-model="form.remember" 
              type="checkbox" 
              class="checkbox"
            >
            <label for="remember">تذكرني</label>
          </div>
          <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
        </div>

        <!-- زر تسجيل الدخول -->
        <button 
          type="submit" 
          :disabled="loading"
          class="login-button"
        >
          {{ loading ? 'جاري تسجيل الدخول...' : 'دخول' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const errors = ref({})
    const showPassword = ref(false)

    const form = ref({ 
      email: '', 
      password: '', 
      remember: false 
    })

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      errors.value = {}
      try {
        await store.dispatch('login', form.value)
        const role = store.getters.userRole
        if (role === 'organizer') {
          router.push('/organizer/dashboard')
        } else if (role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/attendee/events')
        }
      } catch (err) {
        console.error('Login error:', err)
        if (err.response?.data?.errors) {
          errors.value = err.response.data.errors
        } else {
          error.value = err.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
        }
      } finally { 
        loading.value = false 
      }
    }

    return { 
      form, 
      loading, 
      error, 
      errors, 
      showPassword,
      togglePasswordVisibility,
      handleLogin 
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  /* font-family: 'Tajawal', sans-serif; */
}
</style>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark .login-container {
  background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%);
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.dark .login-card {
  background: rgba(17, 24, 39, 0.95);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .login-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.logo-container {
  width: 4rem;
  height: 4rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.dark .logo-container {
  background: rgba(99, 102, 241, 0.2);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #4f46e5;
}

.dark .logo-icon {
  color: #818cf8;
}

.login-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dark .login-title {
  color: #f9fafb;
}

.login-subtitle {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .login-subtitle {
  color: #d1d5db;
}

.register-link {
  color: #6b7280;
  font-size: 0.875rem;
}

.dark .register-link {
  color: #d1d5db;
}

.register-link a {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
}

.dark .register-link a {
  color: #818cf8;
}

.register-link a:hover {
  color: #3730a3;
}

.dark .register-link a:hover {
  color: #a5b4fc;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;
}

.dark .error-message {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-label {
  color: #d1d5db;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.input-icon.left {
  right: auto;
  left: 0.75rem;
}

.input-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #6b7280;
}

.dark .password-toggle:hover {
  color: #d1d5db;
}

.password-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  transition: all 0.3s;
  font-size: 1rem;
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.dark .form-input:focus {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

.form-input.error {
  border-color: #dc2626;
}

.dark .form-input.error {
  border-color: #ef4444;
}

.error-text {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.dark .error-text {
  color: #fca5a5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  color: #4f46e5;
  border-color: #d1d5db;
  border-radius: 0.25rem;
}

.dark .checkbox {
  border-color: #6b7280;
  background: #374151;
}

.remember-me label {
  font-size: 0.875rem;
  color: #374151;
}

.dark .remember-me label {
  color: #d1d5db;
}

.forgot-password {
  font-size: 0.875rem;
  color: #4f46e5;
  text-decoration: none;
  transition: color 0.2s;
}

.dark .forgot-password {
  color: #818cf8;
}

.forgot-password:hover {
  color: #3730a3;
}

.dark .forgot-password:hover {
  color: #a5b4fc;
}

.login-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>