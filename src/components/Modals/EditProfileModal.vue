<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-md">
        
        <!-- Header -->
        <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              <i class="fas fa-user-edit ml-2"></i>
              تعديل البيانات الشخصية
            </h3>
            <button @click="$emit('close')" class="text-white hover:text-gray-200 transition-colors">
              <i class="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="pt-20 pb-6 px-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <!-- صورة البروفايل -->
            <div class="text-center">
              <div class="relative inline-block">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg mx-auto">
                  <img 
                    v-if="previewImage || user?.avatar" 
                    :src="previewImage || user?.avatar" 
                    class="w-full h-full object-cover"
                    alt="صورة البروفايل"
                  >
                  <div v-else class="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                    {{ user?.name?.charAt(0) || '?' }}
                  </div>
                </div>
                <label for="avatar-upload" class="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
                  <i class="fas fa-camera text-sm"></i>
                  <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*" 
                    @change="handleImageUpload" 
                    class="hidden"
                  >
                </label>
              </div>
            </div>

            <!-- الاسم -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-user ml-2"></i>
                الاسم الكامل
              </label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="أدخل اسمك الكامل"
                :class="{ 'border-red-500': errors.name }"
              >
              <p v-if="errors.name" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.name[0] }}
              </p>
            </div>

            <!-- البريد الإلكتروني -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-envelope ml-2"></i>
                البريد الإلكتروني
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="أدخل بريدك الإلكتروني"
                :class="{ 'border-red-500': errors.email }"
              >
              <p v-if="errors.email" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.email[0] }}
              </p>
            </div>

            <!-- رقم الهاتف -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-phone ml-2"></i>
                رقم الهاتف
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="أدخل رقم هاتفك"
                :class="{ 'border-red-500': errors.phone }"
              >
              <p v-if="errors.phone" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.phone[0] }}
              </p>
            </div>

            <!-- العنوان -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i class="fas fa-map-marker-alt ml-2"></i>
                العنوان
              </label>
              <textarea
                v-model="form.address"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300 resize-none"
                placeholder="أدخل عنوانك"
                :class="{ 'border-red-500': errors.address }"
              ></textarea>
              <p v-if="errors.address" class="text-red-500 text-xs mt-2 flex items-center">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ errors.address[0] }}
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
                :disabled="loading"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
                <span>{{ loading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { showToast } from '@/utils/toast'

export default {
  name: 'EditProfileModal',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const { loading, errors, updateProfile } = useProfile()
    const previewImage = ref(null)
    
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      address: '',
      avatar: null
    })

    onMounted(() => {
      if (props.user) {
        form.name = props.user.name || ''
        form.email = props.user.email || ''
        form.phone = props.user.phone || ''
        form.address = props.user.address || ''
      }
    })

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // التحقق من حجم الصورة
        if (file.size > 2 * 1024 * 1024) { // 2MB
          showToast('خطأ', 'حجم الصورة يجب أن يكون أقل من 2MB', 'error')
          return
        }
        
        // التحقق من نوع الصورة
        if (!file.type.startsWith('image/')) {
          showToast('خطأ', 'الملف يجب أن يكون صورة', 'error')
          return
        }
        
        form.avatar = file
        previewImage.value = URL.createObjectURL(file)
      }
    }
  const handleSubmit = async () => {
  try {
    console.log('Form data:', form)
    
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    if (form.phone) formData.append('phone', form.phone)
    if (form.address) formData.append('address', form.address)
    if (form.avatar instanceof File) {
      formData.append('avatar', form.avatar)
    }

    const response = await updateProfile(formData)
    
    if (response) {
      emit('saved', response.user)
      emit('close')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

    return {
      form,
      loading,
      errors,
      previewImage,
      handleImageUpload,
      handleSubmit
    }
  }
}
</script>