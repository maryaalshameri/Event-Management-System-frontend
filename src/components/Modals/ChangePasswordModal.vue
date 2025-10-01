<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-md">
        
        <!-- Header -->
        <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              <i class="fas fa-lock ml-2"></i>
              تغيير كلمة المرور
            </h3>
            <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="pt-20 pb-6 px-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <!-- كلمة المرور الحالية -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-key ml-2"></i>
                كلمة المرور الحالية
              </label>
              <div class="relative">
                <input
                  v-model="form.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-300 pr-12"
                  placeholder="أدخل كلمة المرور الحالية"
                  :class="{ 'border-red-500': errors.current_password }"
                >
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="errors.current_password" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.current_password[0] }}
              </p>
            </div>

            <!-- كلمة المرور الجديدة -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-lock ml-2"></i>
                كلمة المرور الجديدة
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-300 pr-12"
                  placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                  :class="{ 'border-red-500': errors.password }"
                >
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>

              <!-- مؤشر قوة كلمة المرور المحسن -->
              <div v-if="form.password" class="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">قوة كلمة المرور:</span>
                  <span :class="passwordStrength.class" class="text-sm font-semibold">
                    {{ passwordStrength.text }}
                  </span>
                </div>
                
                <!-- شريط التقدم -->
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-700 ease-out"
                    :class="passwordStrength.barClass"
                    :style="`width: ${passwordStrength.percentage}%`"
                  ></div>
                </div>

                <!-- متطلبات كلمة المرور -->
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="flex items-center space-x-2" :class="hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasMinLength ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasMinLength"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>8 أحرف على الأقل</span>
                  </div>

                  <div class="flex items-center space-x-2" :class="hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasUpperCase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasUpperCase"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>حرف كبير (A-Z)</span>
                  </div>

                  <div class="flex items-center space-x-2" :class="hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasLowerCase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasLowerCase"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>حرف صغير (a-z)</span>
                  </div>

                  <div class="flex items-center space-x-2" :class="hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasNumber ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasNumber"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>رقم (0-9)</span>
                  </div>

                  <div class="flex items-center space-x-2" :class="hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasSpecialChar ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasSpecialChar"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>رمز خاص (@#$%...)</span>
                  </div>

                  <div class="flex items-center space-x-2" :class="hasNoSpaces ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                    <div class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" 
                         :class="hasNoSpaces ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'">
                      <i class="fas fa-check text-xs" v-if="hasNoSpaces"></i>
                      <i class="fas fa-times text-xs" v-else></i>
                    </div>
                    <span>بدون مسافات</span>
                  </div>
                </div>

                <!-- نصائح إضافية -->
                <div v-if="passwordStrength.percentage < 100" class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p class="text-xs text-blue-700 dark:text-blue-300 flex items-start space-x-2">
                    <i class="fas fa-lightbulb mt-0.5 text-blue-500"></i>
                    <span>
                      <strong>نصيحة:</strong> 
                      <span v-if="!hasSpecialChar">أضف رمزاً خاصاً مثل @#$% لزيادة الأمان</span>
                      <span v-else-if="!hasUpperCase">أضف حرفاً كبيراً لتعزيز القوة</span>
                      <span v-else-if="!hasNumber">أضف رقماً لجعل كلمة المرور أقوى</span>
                      <span v-else-if="form.password.length < 12">جعل كلمة المرور أطول يزيد من صعوبة التخمين</span>
                    </span>
                  </p>
                </div>
              </div>
              
              <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
            </div>

            <!-- تأكيد كلمة المرور -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-lock ml-2"></i>
                تأكيد كلمة المرور الجديدة
              </label>
              <div class="relative">
                <input
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all duration-300 pr-12"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  :class="{ 'border-red-500': form.password_confirmation && form.password !== form.password_confirmation }"
                >
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <p v-if="form.password_confirmation && form.password !== form.password_confirmation" 
                 class="error-text flex items-center mt-2">
                <i class="fas fa-exclamation-circle ml-1"></i>
                كلمات المرور غير متطابقة
              </p>
            </div>

            <!-- الأزرار -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
                <span>{{ loading ? 'جاري التحديث...' : 'تغيير كلمة المرور' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useProfile } from '@/composables/useProfile'

export default {
  name: 'ChangePasswordModal',
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { loading, errors, updatePassword } = useProfile()
    
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)
    
    const form = reactive({
      current_password: '',
      password: '',
      password_confirmation: ''
    })

    // حساب قوة كلمة المرور المحسن
    const passwordStrength = computed(() => {
      if (!form.password) return { 
        percentage: 0, 
        text: 'ضعيفة', 
        class: 'text-red-500', 
        barClass: 'bg-red-500' 
      }
      
      let strength = 0
      const requirements = [
        form.password.length >= 8,           // 15%
        form.password.length >= 12,          // 10% إضافية للطول
        /[A-Z]/.test(form.password),         // 15%
        /[a-z]/.test(form.password),         // 15%
        /[0-9]/.test(form.password),         // 15%
        /[^A-Za-z0-9]/.test(form.password),  // 20% للرموز الخاصة
        !/\s/.test(form.password)            // 10% لعدم وجود مسافات
      ]
      
      // توزيع النقاط
      if (requirements[0]) strength += 15
      if (requirements[1]) strength += 10
      if (requirements[2]) strength += 15
      if (requirements[3]) strength += 15
      if (requirements[4]) strength += 15
      if (requirements[5]) strength += 20
      if (requirements[6]) strength += 10
      
      if (strength <= 25) return { 
        percentage: 25, 
        text: 'ضعيفة جداً', 
        class: 'text-red-500', 
        barClass: 'bg-gradient-to-r from-red-500 to-red-600' 
      }
      if (strength <= 50) return { 
        percentage: 50, 
        text: 'ضعيفة', 
        class: 'text-orange-500', 
        barClass: 'bg-gradient-to-r from-orange-500 to-orange-600' 
      }
      if (strength <= 75) return { 
        percentage: 75, 
        text: 'جيدة', 
        class: 'text-yellow-500', 
        barClass: 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
      }
      if (strength <= 90) return { 
        percentage: 90, 
        text: 'قوية', 
        class: 'text-blue-500', 
        barClass: 'bg-gradient-to-r from-blue-500 to-blue-600' 
      }
      return { 
        percentage: 100, 
        text: 'قوية جداً', 
        class: 'text-green-500', 
        barClass: 'bg-gradient-to-r from-green-500 to-emerald-600' 
      }
    })

    // متطلبات كلمة المرور
    const hasMinLength = computed(() => form.password.length >= 8)
    const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
    const hasLowerCase = computed(() => /[a-z]/.test(form.password))
    const hasNumber = computed(() => /[0-9]/.test(form.password))
    const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(form.password))
    const hasNoSpaces = computed(() => !/\s/.test(form.password))

    const isFormValid = computed(() => {
      return form.current_password && 
             form.password && 
             form.password_confirmation && 
             form.password === form.password_confirmation &&
             hasMinLength.value
    })

    const handleSubmit = async () => {
      try {
        await updatePassword(form)
        emit('saved')
        form.current_password = ''
        form.password = ''
        form.password_confirmation = ''
      } catch (error) {
        console.error('Error updating password:', error)
      }
    }

    return {
      form,
      loading,
      errors,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      passwordStrength,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasNoSpaces,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.enter-active, .leave-active {
  transition: all 0.3s ease;
}
.enter-from, .leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* تأثيرات إضافية للشريط */
.bg-gradient-to-r {
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* تحسينات للوضع الداكن */
.dark .bg-gray-50 {
  background-color: rgba(17, 24, 39, 0.5);
}

.dark .border-gray-200 {
  border-color: rgba(55, 65, 81, 0.5);
}
</style>