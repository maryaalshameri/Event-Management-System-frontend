<template>
  <div class="register-container">
    <div class="register-card">
      <!-- الشعار -->
      <div class="text-center mb-8">
        <div class="logo-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="register-title">إنشاء حساب جديد</h1>
        <p class="register-subtitle">انضم إلينا وابدأ رحلتك في عالم الفعاليات</p>
        <p class="login-link">
          لديك حساب بالفعل؟ 
          <router-link to="/login">تسجيل الدخول</router-link>
        </p>
      </div>

      <!-- رسائل الخطأ -->
      <div v-if="error" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>

      <!-- نموذج التسجيل -->
      <form class="register-form" @submit.prevent="handleRegister">
        <!-- الاسم الكامل -->
        <div class="form-group">
          <label for="name" class="form-label">الاسم الكامل</label>
          <div class="input-container">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input"
              placeholder="أدخل اسمك الكامل"
              :class="{ 'error': errors.name }"
            >
          </div>
          <p v-if="errors.name" class="error-text">{{ errors.name[0] }}</p>
        </div>

        <!-- البريد الإلكتروني -->
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
              class="form-input"
              placeholder="أدخل بريدك الإلكتروني"
              :class="{ 'error': errors.email }"
            >
          </div>
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <!-- كلمة المرور -->
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
              class="form-input"
              placeholder="كلمة المرور (8 أحرف على الأقل)"
              :class="{ 'error': errors.password }"
            >
          </div>

          <!-- مؤشر قوة كلمة المرور -->
          <div v-if="form.password" class="mt-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">قوة كلمة المرور:</span>
              <span :class="passwordStrength.class" class="text-xs font-medium">
                {{ passwordStrength.text }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="passwordStrength.barClass"
                :style="`width: ${passwordStrength.percentage}%`"
              ></div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center" :class="{ 'text-green-500': hasMinLength }">
                <i class="fas fa-check ml-1 text-xs" v-if="hasMinLength"></i>
                <i class="fas fa-times ml-1 text-xs" v-else></i>
                <span>8 أحرف على الأقل</span>
              </div>
              <div class="flex items-center" :class="{ 'text-green-500': hasUpperCase }">
                <i class="fas fa-check ml-1 text-xs" v-if="hasUpperCase"></i>
                <i class="fas fa-times ml-1 text-xs" v-else></i>
                <span>حرف كبير</span>
              </div>
              <div class="flex items-center" :class="{ 'text-green-500': hasLowerCase }">
                <i class="fas fa-check ml-1 text-xs" v-if="hasLowerCase"></i>
                <i class="fas fa-times ml-1 text-xs" v-else></i>
                <span>حرف صغير</span>
              </div>
              <div class="flex items-center" :class="{ 'text-green-500': hasNumber }">
                <i class="fas fa-check ml-1 text-xs" v-if="hasNumber"></i>
                <i class="fas fa-times ml-1 text-xs" v-else></i>
                <span>رقم واحد</span>
              </div>
              <div class="flex items-center" :class="{ 'text-green-500': hasSpecialChar }">
                <i class="fas fa-check ml-1 text-xs" v-if="hasSpecialChar"></i>
                <i class="fas fa-times ml-1 text-xs" v-else></i>
                <span>رمز خاص</span>
              </div>
            </div>
          </div>
          
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <!-- تأكيد كلمة المرور -->
        <div class="form-group">
          <label for="password_confirmation" class="form-label">تأكيد كلمة المرور</label>
          <div class="input-container">
            <button 
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="password-toggle"
            >
              <svg 
                v-if="showConfirmPassword" 
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="form-input"
              placeholder="أعد إدخال كلمة المرور"
              :class="{ 'error': form.password_confirmation && form.password !== form.password_confirmation }"
            >
          </div>
          <p v-if="form.password_confirmation && form.password !== form.password_confirmation" 
             class="error-text flex items-center">
            <i class="fas fa-exclamation-circle ml-1"></i>
            كلمات المرور غير متطابقة
          </p>
        </div>

        <!-- الهاتف -->
        <div class="form-group">
          <label for="phone" class="form-label">رقم الهاتف</label>
          <div class="input-container">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="رقم الهاتف (اختياري)"
              :class="{ 'error': errors.phone }"
            >
          </div>
          <p v-if="errors.phone" class="error-text">{{ errors.phone[0] }}</p>
        </div>

        <!-- العنوان -->
        <div class="form-group">
          <label for="address" class="form-label">العنوان</label>
          <div class="input-container">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              class="form-input resize-none"
              placeholder="أدخل عنوانك (اختياري)"
              :class="{ 'error': errors.address }"
            ></textarea>
          </div>
          <p v-if="errors.address" class="error-text">{{ errors.address[0] }}</p>
        </div>

        <!-- نوع الحساب -->
        <div class="form-group">
          <label class="form-label">نوع الحساب</label>
          <div class="account-type-grid">
            <label class="account-type-card" :class="{ 'selected': form.role === 'attendee' }">
              <input
                v-model="form.role"
                type="radio"
                value="attendee"
                class="sr-only"
              >
              <div class="account-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="account-type-text">حضور</span>
              <p class="account-type-desc">لحضور الفعاليات والأنشطة</p>
            </label>
            
            <label class="account-type-card" :class="{ 'selected': form.role === 'organizer' }">
              <input
                v-model="form.role"
                type="radio"
                value="organizer"
                class="sr-only"
              >
              <div class="account-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="account-type-text">منظم</span>
              <p class="account-type-desc">لتنظيم الفعاليات وإدارتها</p>
            </label>
          </div>
          <p v-if="errors.role" class="error-text">{{ errors.role[0] }}</p>
        </div>

        <!-- الشروط والأحكام -->
        <div class="form-group">
          <label class="terms-checkbox" :class="{ 'error': errors.terms }">
            <input
              id="terms"
              v-model="form.terms"
              type="checkbox"
              required
              class="checkbox"
            >
            <span class="checkmark"></span>
            <span class="terms-text">
              أوافق على 
              <a href="#" class="terms-link">الشروط والأحكام</a>
              و
              <a href="#" class="terms-link">سياسة الخصوصية</a>
            </span>
          </label>
          <p v-if="errors.terms" class="error-text">{{ errors.terms[0] }}</p>
        </div>

        <!-- زر التسجيل -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="register-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const errors = ref({})
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '', // أضفنا حقل العنوان
      role: 'attendee',
      terms: false
    })

    // حساب قوة كلمة المرور
    const passwordStrength = computed(() => {
      if (!form.password) return { percentage: 0, text: 'ضعيفة', class: 'text-red-500', barClass: 'bg-red-500' }
      
      let strength = 0
      const requirements = [
        form.password.length >= 8,      // 20%
        /[A-Z]/.test(form.password),    // 20%
        /[a-z]/.test(form.password),    // 20%
        /[0-9]/.test(form.password),    // 20%
        /[^A-Za-z0-9]/.test(form.password) // 20%
      ]
      
      requirements.forEach(req => {
        if (req) strength += 20
      })
      
      if (strength <= 20) return { percentage: 20, text: 'ضعيفة جداً', class: 'text-red-500', barClass: 'bg-red-500' }
      if (strength <= 40) return { percentage: 40, text: 'ضعيفة', class: 'text-red-500', barClass: 'bg-red-500' }
      if (strength <= 60) return { percentage: 60, text: 'متوسطة', class: 'text-yellow-500', barClass: 'bg-yellow-500' }
      if (strength <= 80) return { percentage: 80, text: 'جيدة', class: 'text-blue-500', barClass: 'bg-blue-500' }
      return { percentage: 100, text: 'قوية جداً', class: 'text-green-500', barClass: 'bg-green-500' }
    })

    // متطلبات كلمة المرور
    const hasMinLength = computed(() => form.password.length >= 8)
    const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
    const hasLowerCase = computed(() => /[a-z]/.test(form.password))
    const hasNumber = computed(() => /[0-9]/.test(form.password))
    const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(form.password))

    // التحقق من صحة النموذج
    const isFormValid = computed(() => {
      return form.name && 
             form.email && 
             form.password && 
             form.password_confirmation && 
             form.password === form.password_confirmation &&
             form.terms &&
             hasMinLength.value
    })

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const toggleConfirmPasswordVisibility = () => {
      showConfirmPassword.value = !showConfirmPassword.value
    }

    const handleRegister = async () => {
      loading.value = true
      error.value = ''
      errors.value = {}

      try {
        // تأكد من إرسال جميع الحقول المطلوبة
        const registerData = {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          phone: form.phone || '', // تأكد من إرسال قيمة حتى لو فارغة
          address: form.address || '', // تأكد من إرسال قيمة حتى لو فارغة
          role: form.role,
          terms: form.terms
        }

        console.log('Sending registration data:', registerData)

        await store.dispatch('register', registerData)
        
        // التوجيه حسب نوع المستخدم
        const userRole = store.getters.userRole
        if (userRole === 'organizer') {
          router.push('/organizer/dashboard')
        } else {
          router.push('/attendee/events')
        }
        
      } catch (err) {
        console.error('Registration error:', err)
        
        if (err.response?.data?.errors) {
          errors.value = err.response.data.errors
          error.value = 'يوجد أخطاء في البيانات المدخلة'
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message
        } else if (err.message) {
          error.value = err.message
        } else {
          error.value = 'حدث خطأ أثناء إنشاء الحساب'
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
      showConfirmPassword,
      passwordStrength,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isFormValid,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      handleRegister
    }
  }
}
</script>

<style scoped>
/* إضافة أنماط جديدة لحقل العنوان */
.form-input {
  min-height: auto;
}

textarea.form-input {
  min-height: 80px;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  line-height: 1.5;
}

/* باقي الستايلات تبقى كما هي */
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Tajawal', sans-serif;
}

.dark .register-container {
  background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%);
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  margin: 1rem;
}

.dark .register-card {
  background: rgba(17, 24, 39, 0.95);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3);
}

.logo-container {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.register-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dark .register-title {
  color: #f9fafb;
}

.register-subtitle {
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.dark .register-subtitle {
  color: #d1d5db;
}

.login-link {
  color: #6b7280;
  font-size: 0.95rem;
}

.dark .login-link {
  color: #d1d5db;
}

.login-link a {
  color: #10b981;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.dark .login-link a {
  color: #34d399;
}

.login-link a:hover {
  color: #059669;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideDown 0.3s ease;
}

.dark .error-message {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
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
  right: 1rem;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.input-icon.left {
  right: auto;
  left: 1rem;
}

.input-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
  z-index: 10;
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
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.3s;
  font-size: 1rem;
  font-family: 'Tajawal', sans-serif;
}

.dark .form-input {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.dark .form-input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.form-input.error {
  border-color: #dc2626;
}

.dark .form-input.error {
  border-color: #ef4444;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.dark .error-text {
  color: #fca5a5;
}

.account-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.account-type-card {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  overflow: hidden;
}

.dark .account-type-card {
  background: #374151;
  border-color: #4b5563;
}

.account-type-card:hover {
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.account-type-card.selected {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2);
  transform: translateY(-2px);
}

.dark .account-type-card.selected {
  background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
  border-color: #34d399;
}

.account-icon {
  width: 3rem;
  height: 3rem;
  background: #f0fdf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  transition: all 0.3s ease;
}

.dark .account-icon {
  background: #064e3b;
}

.account-type-card.selected .account-icon {
  background: #10b981;
}

.account-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #059669;
  transition: color 0.3s ease;
}

.dark .account-icon svg {
  color: #34d399;
}

.account-type-card.selected .account-icon svg {
  color: white;
}

.account-type-text {
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.dark .account-type-text {
  color: #f9fafb;
}

.account-type-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.dark .account-type-desc {
  color: #d1d5db;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.terms-checkbox:hover {
  background: #f9fafb;
}

.dark .terms-checkbox:hover {
  background: #374151;
}

.terms-checkbox.error {
  background: #fef2f2;
}

.dark .terms-checkbox.error {
  background: #450a0a;
}

.checkbox {
  position: absolute;
  opacity: 0;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  position: relative;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s;
}

.dark .checkmark {
  border-color: #6b7280;
}

.terms-checkbox .checkbox:checked + .checkmark {
  background: #10b981;
  border-color: #10b981;
}

.terms-checkbox .checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 30%;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.terms-text {
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.5;
}

.dark .terms-text {
  color: #d1d5db;
}

.terms-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.dark .terms-link {
  color: #34d399;
}

.terms-link:hover {
  color: #059669;
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.4);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 640px) {
  .register-card {
    padding: 2rem 1.5rem;
    margin: 0.5rem;
  }
  
  .account-type-grid {
    grid-template-columns: 1fr;
  }
  
  .register-title {
    font-size: 1.75rem;
  }
}
</style>