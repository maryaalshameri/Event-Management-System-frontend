<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-4">
    <div class="w-full max-w-lg">
      <!-- البطاقة الرئيسية -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-3xl">
        
        <!-- الهيدر -->
        <div class="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
          <div class="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div class="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
            <i class="fas fa-key text-white text-2xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">
            {{ showResetForm ? 'كلمة مرور جديدة' : 'نسيت كلمة المرور' }}
          </h1>
          <p class="text-blue-100 text-sm">
            {{ showResetForm ? 'اختر كلمة مرور قوية وآمنة' : 'سنرسل لك رمز التحقق على بريدك' }}
          </p>
        </div>

        <!-- المحتوى -->
        <div class="p-8">
          <!-- رسائل التنبيه -->
          <div v-if="error" class="alert-error animate-fade-in mb-3">
            <i class="fas fa-exclamation-circle ml-2"></i>
            {{ error }}
          </div>

          <div v-if="success" class="alert-success animate-fade-in mb-3">
            <i class="fas fa-check-circle ml-2"></i>
            {{ success }}
          </div>

          <!-- نموذج طلب الرمز -->
          <form v-if="!showResetForm" @submit.prevent="sendResetLink" class="space-y-6">
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-envelope ml-2 text-purple-500"></i>
                البريد الإلكتروني
              </label>
              <div class="input-container-glow group">
                <i class="fas fa-envelope input-icon group-focus-within:text-purple-500"></i>
                <input
                  v-model="email"
                  type="email"
                  required
                  class="input-field peer"
                  placeholder="أدخل بريدك الإلكتروني"
                >
                <!-- تأثير الجلو -->
                <div class="glow-effect"></div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <i class="fas fa-info-circle ml-1"></i>
                سنرسل رمز تحقق إلى هذا البريد
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full transform transition-all duration-300 hover:scale-105 group"
            >
              <i class="fas fa-paper-plane ml-2 group-hover:scale-110 transition-transform"></i>
              {{ loading ? 'جاري الإرسال...' : 'إرسال الرمز' }}
              <div class="btn-shine"></div>
            </button>

            <div class="text-center">
              <router-link to="/login" class="link-text">
                <i class="fas fa-arrow-right ml-2"></i>
                العودة لتسجيل الدخول
              </router-link>
            </div>
          </form>

          <!-- نموذج إعادة التعيين -->
          <form v-else @submit.prevent="resetPassword" class="space-y-6">
            <!-- معلومات البريد -->
            <div class="info-card">
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <i class="fas fa-envelope-open text-white text-lg"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-300">تم الإرسال إلى</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <i class="fas fa-at ml-2 text-purple-500"></i>
                    {{ email }}
                  </p>
                </div>
              </div>
            </div>

            <!-- حقل الرمز -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-shield-alt ml-2 text-blue-500"></i>
                رمز التحقق
              </label>
              <div class="input-container-glow group">
                <i class="fas fa-shield-alt input-icon group-focus-within:text-blue-500"></i>
                <input
                  v-model="token"
                  type="text"
                  required
                  maxlength="6"
                  class="input-field text-center tracking-widest font-mono text-lg peer"
                  placeholder="أدخل الرمز المكون من 6 أرقام"
                >
                <div class="glow-effect"></div>
              </div>
            </div>

            <!-- حقل كلمة المرور -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-lock ml-2 text-green-500"></i>
                كلمة المرور الجديدة
              </label>
              <div class="input-container-glow group relative">
                <i class="fas fa-lock input-icon group-focus-within:text-green-500"></i>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input-field peer pr-12"
                  placeholder="كلمة المرور الجديدة"
                  @input="checkPasswordStrength"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <div class="glow-effect"></div>
              </div>
            </div>

            <!-- مؤشر قوة كلمة المرور -->
            <div v-if="password" class="password-strength-container">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <i class="fas fa-battery-quarter ml-2"></i>
                  قوة كلمة المرور:
                </span>
                <span :class="strength.class" class="text-sm font-bold flex items-center">
                  <i :class="strength.icon" class="ml-1"></i>
                  {{ strength.text }}
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="h-3 rounded-full transition-all duration-1000 ease-out"
                  :class="strength.barClass"
                  :style="{ width: strength.percentage + '%' }"
                ></div>
              </div>
              
              <!-- متطلبات كلمة المرور -->
              <div class="mt-4 grid grid-cols-1 gap-3">
                <div v-for="req in requirements" :key="req.id" class="flex items-center transition-all duration-500">
                  <div :class="req.met ? 'requirement-met' : 'requirement-not-met'">
                    <i :class="req.met ? 'fas fa-check' : 'fas fa-times'"></i>
                  </div>
                  <span :class="req.met ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400'"
                        class="text-sm mr-3 transition-all duration-300">
                    {{ req.text }}
                  </span>
                  <i v-if="req.met" class="fas fa-check-circle text-green-500 text-sm"></i>
                </div>
              </div>
            </div>

            <!-- حقل تأكيد كلمة المرور -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-lock ml-2 text-blue-500"></i>
                تأكيد كلمة المرور
              </label>
              <div class="input-container-glow group relative">
                <i class="fas fa-lock input-icon group-focus-within:text-blue-500"></i>
                <input
                  v-model="password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="input-field peer pr-12"
                  placeholder="أعد إدخال كلمة المرور"
                  :class="password_confirmation ? (password === password_confirmation ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700') : ''"
                >
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <div v-if="password_confirmation" class="absolute left-12 top-1/2 transform -translate-y-1/2 z-10">
                  <i v-if="password === password_confirmation" class="fas fa-check-circle text-green-500 text-lg"></i>
                  <i v-else class="fas fa-times-circle text-red-500 text-lg"></i>
                </div>
                <div class="glow-effect"></div>
              </div>
              <p v-if="password_confirmation && password !== password_confirmation" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-triangle ml-1"></i>
                كلمات المرور غير متطابقة
              </p>
            </div>

            <!-- أزرار التحكم -->
            <div class="flex gap-4">
              <button
                type="button"
                @click="showResetForm = false"
                class="btn-secondary flex-1 group"
              >
                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                رجوع
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="btn-primary flex-1 transform transition-all duration-300 hover:scale-105 group relative overflow-hidden"
              >
                <i v-if="!loading" class="fas fa-key ml-2 group-hover:scale-110 transition-transform"></i>
                <i v-else class="fas fa-spinner fa-spin ml-2"></i>
                {{ loading ? 'جاري التعيين...' : 'تعيين كلمة المرور' }}
                <div class="btn-shine"></div>
              </button>
            </div>
          </form>
        </div>

        <!-- الفوتر -->
        <div class="bg-gray-50 dark:bg-gray-700 px-8 py-4 text-center border-t border-gray-200 dark:border-gray-600">
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
            <i class="fas fa-shield-alt mx-1 text-green-500"></i>
            نظام آمن ومشفر
            <i class="fas fa-lock mx-1 text-blue-500"></i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

export default {
  name: 'ForgotPassword',
  setup() {
    const router = useRouter()
    const email = ref('')
    const token = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const showResetForm = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // متطلبات كلمة المرور
    const requirements = reactive([
      { id: 1, text: '8 أحرف على الأقل', met: false, check: (pwd) => pwd.length >= 8 },
      { id: 2, text: 'حرف كبير واحد على الأقل', met: false, check: (pwd) => /[A-Z]/.test(pwd) },
      { id: 3, text: 'حرف صغير واحد على الأقل', met: false, check: (pwd) => /[a-z]/.test(pwd) },
      { id: 4, text: 'رقم واحد على الأقل', met: false, check: (pwd) => /[0-9]/.test(pwd) },
      { id: 5, text: 'رمز خاص واحد على الأقل', met: false, check: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
    ])

    // حساب قوة كلمة المرور مع أيقونات
    const strength = computed(() => {
      if (!password.value) {
        return { 
          percentage: 0, 
          text: 'ضعيفة', 
          class: 'text-red-500', 
          barClass: 'bg-red-500',
          icon: 'fas fa-battery-empty'
        }
      }

      let score = 0
      requirements.forEach(req => {
        if (req.met) score += 20
      })

      if (score <= 20) return { 
        percentage: 20, 
        text: 'ضعيفة جداً', 
        class: 'text-red-500', 
        barClass: 'bg-gradient-to-r from-red-500 to-red-600',
        icon: 'fas fa-battery-quarter'
      }
      if (score <= 40) return { 
        percentage: 40, 
        text: 'ضعيفة', 
        class: 'text-orange-500', 
        barClass: 'bg-gradient-to-r from-orange-500 to-orange-600',
        icon: 'fas fa-battery-half'
      }
      if (score <= 60) return { 
        percentage: 60, 
        text: 'متوسطة', 
        class: 'text-yellow-500', 
        barClass: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        icon: 'fas fa-battery-three-quarters'
      }
      if (score <= 80) return { 
        percentage: 80, 
        text: 'جيدة', 
        class: 'text-blue-500', 
        barClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: 'fas fa-battery-full'
      }
      return { 
        percentage: 100, 
        text: 'قوية جداً', 
        class: 'text-green-500', 
        barClass: 'bg-gradient-to-r from-green-500 to-green-600',
        icon: 'fas fa-battery-full text-green-500'
      }
    })

    // التحقق من صحة النموذج
    const isFormValid = computed(() => {
      return token.value && 
             password.value && 
             password_confirmation.value && 
             password.value === password_confirmation.value &&
             strength.value.percentage >= 60
    })

    // فحص قوة كلمة المرور
    const checkPasswordStrength = () => {
      requirements.forEach(req => {
        req.met = req.check(password.value)
      })
    }

    const sendResetLink = async () => {
      loading.value = true
      error.value = ''
      success.value = ''

      try {
        const response = await api.post('/password/email', {
          email: email.value
        })

        if (response.status === 200) {
          success.value = '📧 تم إرسال رمز التحقق إلى بريدك الإلكتروني'
          showResetForm.value = true
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'حدث خطأ أثناء إرسال رمز التحقق'
      } finally {
        loading.value = false
      }
    }

    const resetPassword = async () => {
      loading.value = true
      error.value = ''
      success.value = ''

      if (password.value !== password_confirmation.value) {
        error.value = '⚠️ كلمات المرور غير متطابقة'
        loading.value = false
        return
      }

      try {
        const response = await api.post('/password/reset', {
          token: token.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        })

        if (response.status === 200) {
          success.value = '🎉 تم إعادة تعيين كلمة المرور بنجاح!'
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'حدث خطأ أثناء تعيين كلمة المرور'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      token,
      password,
      password_confirmation,
      loading,
      error,
      success,
      showResetForm,
      showPassword,
      showConfirmPassword,
      requirements,
      strength,
      isFormValid,
      checkPasswordStrength,
      sendResetLink,
      resetPassword
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

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(200%) rotate(45deg); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px -5px rgba(168, 85, 247, 0.3);
}

</style>