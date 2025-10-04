<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
    <!-- خلفية متحركة -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- البطاقة الرئيسية -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-3xl">
        
        <!-- الهيدر -->
        <div class="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-8 text-center">
          <div class="absolute top-4 right-4">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <!-- الشعار -->
          <div class="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <div class="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center">
              <i class="fas fa-lock text-white text-2xl"></i>
            </div>
          </div>
          
          <h1 class="text-3xl font-bold text-white mb-2">
            تسجيل الدخول
          </h1>
          <p class="text-blue-100 text-sm">
            أهلاً بعودتك! أدخل بياناتك للوصول إلى حسابك
          </p>
        </div>

        <!-- المحتوى -->
        <div class="p-8">
          <!-- رسائل التنبيه -->
          <div v-if="error" class="alert-error animate-fade-in mb-6">
            <i class="fas fa-exclamation-triangle ml-2"></i>
            {{ error }}
          </div>

          <!-- نموذج تسجيل الدخول -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- حقل البريد الإلكتروني -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-envelope ml-2 text-purple-500"></i>
                البريد الإلكتروني
              </label>
              <div class="input-container-glow group">
                <i class="fas fa-envelope input-icon group-focus-within:text-purple-500"></i>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="input-field peer"
                  placeholder="أدخل بريدك الإلكتروني"
                  :class="errors.email ? 'border-red-500' : ''"
                >
                <div class="glow-effect"></div>
              </div>
              <p v-if="errors.email" class="error-text">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.email[0] }}
              </p>
            </div>

            <!-- حقل كلمة المرور -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-lock ml-2 text-blue-500"></i>
                كلمة المرور
              </label>
              <div class="input-container-glow group relative">
                <i class="fas fa-lock input-icon group-focus-within:text-blue-500"></i>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input-field peer pr-12"
                  placeholder="أدخل كلمة المرور"
                  :class="errors.password ? 'border-red-500' : ''"
                >
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <div class="glow-effect"></div>
              </div>
              <p v-if="errors.password" class="error-text">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.password[0] }}
              </p>
            </div>

            <!-- تذكرني ونسيت كلمة المرور -->
            <div class="flex justify-between items-center">
              <label class="remember-checkbox">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="checkbox"
                >
                <span class="checkmark"></span>
                <span class="remember-text">
                  <i class="fas fa-check ml-1"></i>
                  تذكرني
                </span>
              </label>
              
              <router-link to="/forgot-password" class="forgot-link">
                <i class="fas fa-key ml-1"></i>
                نسيت كلمة المرور؟
              </router-link>
            </div>

            <!-- زر تسجيل الدخول -->
            <button
              type="submit"
              :disabled="loading"
              class="login-btn w-full transform transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            >
              <div class="flex items-center justify-center">
                <i v-if="!loading" class="fas fa-sign-in-alt ml-2 group-hover:scale-110 transition-transform"></i>
                <i v-else class="fas fa-spinner fa-spin ml-2"></i>
                {{ loading ? 'جاري تسجيل الدخول...' : 'دخول إلى الحساب' }}
              </div>
              <div class="btn-shine"></div>
              <div class="btn-particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
              </div>
            </button>

            <!-- رابط إنشاء حساب جديد -->
            <div class="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                ليس لديك حساب؟ 
                <router-link to="/register" class="register-link">
                  <i class="fas fa-user-plus ml-1"></i>
                  إنشاء حساب جديد
                </router-link>
              </p>
            </div>
          </form>
        </div>

        <!-- الفوتر -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 px-8 py-4 text-center border-t border-gray-200 dark:border-gray-600">
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2 space-x-reverse">
            <i class="fas fa-shield-alt text-green-500"></i>
            <span>نظام آمن ومشفر</span>
            <i class="fas fa-lock text-blue-500"></i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Login',
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
        
        // توجيه حسب الدور مع تأثيرات
        setTimeout(() => {
          if (role === 'organizer') {
            router.push('/organizer/dashboard')
          } else if (role === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/attendee/events')
          }
        }, 1000)
        
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

<style scoped>
/* أنيميشن مخصص */
@keyframes fade-in {
  from { 
    opacity: 0; 
    transform: translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.shadow-3xl {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 25px -5px rgba(168, 85, 247, 0.3),
    0 0 50px -12px rgba(59, 130, 246, 0.3);
}

/* أنماط مخصصة */

.particle:nth-child(1) {
  top: 20%; left: 10%;
  animation: float 3s ease-in-out infinite;
}

.particle:nth-child(2) {
  top: 60%; left: 80%;
  animation: float 3s ease-in-out infinite 1s;
}

.particle:nth-child(3) {
  top: 40%; left: 40%;
  animation: float 3s ease-in-out infinite 2s;
}





/* تحسينات الوضع الداكن */
.dark .input-field {
  background: rgba(55, 65, 81, 0.8);
}

.dark .login-card {
  background: rgba(17, 24, 39, 0.8);
}
</style>