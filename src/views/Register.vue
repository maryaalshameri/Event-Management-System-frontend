<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
    <!-- خلفية متحركة -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10">
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
              <i class="fas fa-user-plus text-white text-2xl"></i>
            </div>
          </div>
          
          <h1 class="text-3xl font-bold text-white mb-2">
            إنشاء حساب جديد
          </h1>
          <p class="text-blue-100 text-sm">
            انضم إلينا وابدأ رحلتك في عالم الفعاليات
          </p>
        </div>

        <!-- المحتوى -->
        <div class="p-8">
          <!-- رسائل التنبيه -->
          <div v-if="error" class="alert-error animate-fade-in mb-6">
            <i class="fas fa-exclamation-triangle ml-2"></i>
            {{ error }}
          </div>
              <div v-if="error" class="alert-error animate-fade-in mb-6">
    <i class="fas fa-exclamation-triangle ml-2"></i>
    {{ error }}
  </div>
          <!-- نموذج التسجيل -->
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- الصف الأول: الاسم والبريد -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- الاسم الكامل -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-user ml-2 text-purple-500"></i>
                  الاسم الكامل
                </label>
                <div class="input-container-glow group">
                  <i class="fas fa-user input-icon group-focus-within:text-purple-500"></i>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="input-field peer"
                    placeholder="أدخل اسمك الكامل"
                    :class="{ 'border-red-500': errors.name }"
                  >
                  <div class="glow-effect"></div>
                </div>
                <p v-if="errors.name" class="error-text">
                  <i class="fas fa-exclamation-circle ml-1"></i>
                  {{ errors.name[0] }}
                </p>
              </div>

              <!-- البريد الإلكتروني -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-envelope ml-2 text-blue-500"></i>
                  البريد الإلكتروني
                </label>
                <div class="input-container-glow group">
                  <i class="fas fa-envelope input-icon group-focus-within:text-blue-500"></i>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="input-field peer"
                    placeholder="أدخل بريدك الإلكتروني"
                    :class="{ 'border-red-500': errors.email }"
                  >
                  <div class="glow-effect"></div>
                </div>
                <p v-if="errors.email" class="error-text">
                  <i class="fas fa-exclamation-circle ml-1"></i>
                  {{ errors.email[0] }}
                </p>
              </div>
            </div>

            <!-- الصف الثاني: كلمة المرور وتأكيدها -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- كلمة المرور -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-lock ml-2 text-green-500"></i>
                  كلمة المرور
                </label>
                <div class="input-container-glow group relative">
                  <i class="fas fa-lock input-icon group-focus-within:text-green-500"></i>
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="input-field peer pr-12"
                    placeholder="كلمة المرور الجديدة"
                    :class="{ 'border-red-500': errors.password }"
                    @input="checkPasswordStrength"
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
              </div>

              <!-- تأكيد كلمة المرور -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-lock ml-2 text-blue-500"></i>
                  تأكيد كلمة المرور
                </label>
                <div class="input-container-glow group relative">
                  <i class="fas fa-lock input-icon group-focus-within:text-blue-500"></i>
                  <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="input-field peer pr-12"
                    placeholder="أعد إدخال كلمة المرور"
                    :class="form.password_confirmation ? (form.password === form.password_confirmation ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700') : ''"
                  >
                  <button
                    type="button"
                    @click="toggleConfirmPasswordVisibility"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                  <div v-if="form.password_confirmation" class="absolute left-12 top-1/2 transform -translate-y-1/2 z-10">
                    <i v-if="form.password === form.password_confirmation" class="fas fa-check-circle text-green-500 text-lg"></i>
                    <i v-else class="fas fa-times-circle text-red-500 text-lg"></i>
                  </div>
                  <div class="glow-effect"></div>
                </div>
                <p v-if="form.password_confirmation && form.password !== form.password_confirmation" class="error-text">
                  <i class="fas fa-exclamation-triangle ml-1"></i>
                  كلمات المرور غير متطابقة
                </p>
                <p v-if="errors.password" class="error-text">
                  <i class="fas fa-exclamation-circle ml-1"></i>
                  {{ errors.password[0] }}
                </p>
              </div>
            </div>

            <!-- مؤشر قوة كلمة المرور -->
            <div v-if="form.password" class="password-strength-container">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <i class="fas fa-battery-quarter ml-2"></i>
                  قوة كلمة المرور:
                </span>
                <span :class="passwordStrength.class" class="text-sm font-bold flex items-center">
                  <i :class="passwordStrength.icon" class="ml-1"></i>
                  {{ passwordStrength.text }}
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  class="h-3 rounded-full transition-all duration-1000 ease-out"
                  :class="passwordStrength.barClass"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
              
              <!-- متطلبات كلمة المرور -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <!-- الصف الثالث: الهاتف والعنوان -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- الهاتف -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-phone ml-2 text-purple-500"></i>
                  رقم الهاتف
                  <span class="text-gray-400 text-xs mr-2">(اختياري)</span>
                </label>
                <div class="input-container-glow group">
                  <i class="fas fa-phone input-icon group-focus-within:text-purple-500"></i>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="input-field peer"
                    placeholder="رقم الهاتف"
                    :class="{ 'border-red-500': errors.phone }"
                  >
                  <div class="glow-effect"></div>
                </div>
                <p v-if="errors.phone" class="error-text">
                  <i class="fas fa-exclamation-circle ml-1"></i>
                  {{ errors.phone[0] }}
                </p>
              </div>

              <!-- العنوان -->
              <div class="form-group-animated">
                <label class="form-label">
                  <i class="fas fa-map-marker-alt ml-2 text-blue-500"></i>
                  العنوان
                  <span class="text-gray-400 text-xs mr-2">(اختياري)</span>
                </label>
                <div class="input-container-glow group">
                  <i class="fas fa-map-marker-alt input-icon group-focus-within:text-blue-500"></i>
                  <textarea
                    id="address"
                    v-model="form.address"
                    rows="3"
                    class="input-field resize-none peer"
                    placeholder="أدخل عنوانك"
                    :class="{ 'border-red-500': errors.address }"
                  ></textarea>
                  <div class="glow-effect"></div>
                </div>
                <p v-if="errors.address" class="error-text">
                  <i class="fas fa-exclamation-circle ml-1"></i>
                  {{ errors.address[0] }}
                </p>
              </div>
            </div>

            <!-- نوع الحساب -->
            <div class="form-group-animated">
              <label class="form-label">
                <i class="fas fa-user-tag ml-2 text-cyan-500"></i>
                نوع الحساب
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="account-type-card group" :class="{ 'selected': form.role === 'attendee' }">
                  <input
                    v-model="form.role"
                    type="radio"
                    value="attendee"
                    class="sr-only"
                  >
                  <div class="account-icon group-hover:scale-110 transition-transform">
                    <i class="fas fa-user-check text-green-500"></i>
                  </div>
                  <span class="account-type-text">حضور</span>
                  <p class="account-type-desc">لحضور الفعاليات والأنشطة</p>
                  <div class="selection-indicator">
                    <i class="fas fa-check"></i>
                  </div>
                </label>
                
                <label class="account-type-card group" :class="{ 'selected': form.role === 'organizer' }">
                  <input
                    v-model="form.role"
                    type="radio"
                    value="organizer"
                    class="sr-only"
                  >
                  <div class="account-icon group-hover:scale-110 transition-transform">
                    <i class="fas fa-calendar-alt text-blue-500"></i>
                  </div>
                  <span class="account-type-text">منظم</span>
                  <p class="account-type-desc">لتنظيم الفعاليات وإدارتها</p>
                  <div class="selection-indicator">
                    <i class="fas fa-check"></i>
                  </div>
                </label>
              </div>
              <p v-if="errors.role" class="error-text">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.role[0] }}
              </p>
            </div>

            <!-- الشروط والأحكام -->
            <div class="form-group-animated">
              <label class="terms-checkbox" :class="{ 'error-border': errors.terms }">
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
              <p v-if="errors.terms" class="error-text">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.terms[0] }}
              </p>
            </div>

            <!-- زر التسجيل -->
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="btn-primary w-full transform transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            >
              <div class="flex items-center justify-center">
                <i v-if="!loading" class="fas fa-user-plus ml-2 group-hover:scale-110 transition-transform"></i>
                <i v-else class="fas fa-spinner fa-spin ml-2"></i>
                {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد' }}
              </div>
              <div class="btn-shine"></div>
              <div class="btn-particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
              </div>
            </button>

            <!-- رابط تسجيل الدخول -->
            <div class="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                لديك حساب بالفعل؟ 
                <router-link to="/login" class="link-text">
                  <i class="fas fa-sign-in-alt ml-1"></i>
                  تسجيل الدخول
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
      address: '',
      role: 'attendee',
      terms: false
    })

    // متطلبات كلمة المرور
    const requirements = reactive([
      { id: 1, text: '8 أحرف على الأقل', met: false, check: (pwd) => pwd.length >= 8 },
      { id: 2, text: 'حرف كبير واحد على الأقل', met: false, check: (pwd) => /[A-Z]/.test(pwd) },
      { id: 3, text: 'حرف صغير واحد على الأقل', met: false, check: (pwd) => /[a-z]/.test(pwd) },
      { id: 4, text: 'رقم واحد على الأقل', met: false, check: (pwd) => /[0-9]/.test(pwd) },
      { id: 5, text: 'رمز خاص واحد على الأقل', met: false, check: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
    ])

    // حساب قوة كلمة المرور مع أيقونات
    const passwordStrength = computed(() => {
      if (!form.password) {
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
      return form.name && 
             form.email && 
             form.password && 
             form.password_confirmation && 
             form.password === form.password_confirmation &&
             form.terms &&
             passwordStrength.value.percentage >= 60
    })

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const toggleConfirmPasswordVisibility = () => {
      showConfirmPassword.value = !showConfirmPassword.value
    }

    // فحص قوة كلمة المرور
    const checkPasswordStrength = () => {
      requirements.forEach(req => {
        req.met = req.check(form.password)
      })
    }

    const handleRegister = async () => {
      loading.value = true
      error.value = ''
      errors.value = {}

      try {
        const registerData = {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          phone: form.phone || '',
          address: form.address || '',
          role: form.role,
          terms: form.terms
        }

        await store.dispatch('register', registerData)
        
        const userRole = store.getters.userRole
        setTimeout(() => {
          if (userRole === 'organizer') {
            router.push('/organizer/dashboard')
          } else {
            router.push('/attendee/events')
          }
        }, 1000)
        
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
      requirements,
      passwordStrength,
      isFormValid,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      checkPasswordStrength,
      handleRegister
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

/* أنماط مخصصة للتسجيل */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  }
</style>