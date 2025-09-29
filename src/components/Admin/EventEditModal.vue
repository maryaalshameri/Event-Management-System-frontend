<template>
  <Modal :show="show" @close="handleClose" max-width="4xl">
    <div class="p-6">
      <!-- الهيدر -->
      <div class="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-3">
            <i class="fas fa-edit text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              تعديل الفعالية
            </h2>
            <p class="text-sm text-gray-500 mt-1">تعديل بيانات الفعالية المحددة</p>
          </div>
        </div>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 text-lg transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- نموذج التعديل -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- الاسم -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الفعالية *
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('title')"
            >
            <div v-if="errors.title" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.title }}
            </div>
          </div>

          <!-- الفئة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الفئة *
            </label>
            <select
              v-model="formData.category"
              required
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('category')"
            >
              <option value="">اختر الفئة</option>
               <option value="festival">موسيقى</option>
              <option value="sports">رياضة</option>
              <option value="conference">مؤتمر</option>
              <option value="workshop">ورشة عمل</option>
              <option value="concert">معرض</option>
            </select>
            <div v-if="errors.category" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.category }}
            </div>
          </div>

          <!-- تاريخ البدء -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ البدء *
            </label>
            <input
              v-model="formData.start_date"
              type="datetime-local"
              required
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.start_date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('start_date')"
            >
            <div v-if="errors.start_date" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.start_date }}
            </div>
          </div>

          <!-- تاريخ النهاية -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تاريخ النهاية
            </label>
            <input
              v-model="formData.end_date"
              type="datetime-local"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.end_date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('end_date')"
            >
            <div v-if="errors.end_date" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.end_date }}
            </div>
          </div>

          <!-- السعة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              السعة الكلية *
            </label>
            <input
              v-model.number="formData.capacity"
              type="number"
              min="1"
              required
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.capacity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('capacity')"
            >
            <div v-if="errors.capacity" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.capacity }}
            </div>
          </div>

          <!-- السعر -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              السعر (ر.س)
            </label>
            <input
              v-model.number="formData.price"
              type="number"
              min="0"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('price')"
            >
            <div v-if="errors.price" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.price }}
            </div>
          </div>

          <!-- المكان -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المكان
            </label>
            <input
              v-model="formData.location"
              type="text"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('location')"
            >
            <div v-if="errors.location" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.location }}
            </div>
          </div>

          <!-- الوصف -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('description')"
            ></textarea>
            <div v-if="errors.description" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.description }}
            </div>
          </div>

          <!-- الحالة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الحالة *
            </label>
            <select
              v-model="formData.status"
              required
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              ]"
              @blur="validateField('status')"
            >
              <option value="">اختر الحالة</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="cancelled">ملغي</option>
              <option value="completed">مكتمل</option>
            </select>
            <div v-if="errors.status" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle ml-1"></i>
              {{ errors.status }}
            </div>
          </div>
        </div>

        <!-- ملخص الأخطاء -->
        <div v-if="Object.keys(errors).length > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 ml-2"></i>
            <h3 class="text-red-800 dark:text-red-200 font-medium">يوجد أخطاء في النموذج</h3>
          </div>
          <ul class="text-red-700 dark:text-red-300 text-sm mt-2 list-disc mr-4">
            <li v-for="error in Object.values(errors)" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- الأزرار -->
        <div class="flex justify-end space-x-3 pt-6 border-t dark:border-gray-600">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="saving || !isFormValid"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving" class="flex items-center">
              <i class="fas fa-spinner fa-spin ml-2"></i>
              جاري الحفظ...
            </span>
            <span v-else>حفظ التغييرات</span>
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  event: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const errors = ref({})
const formData = ref({
  title: '',
  category: '',
  start_date: '',
  end_date: '',
  capacity: 0,
  price: 0,
  location: '',
  description: '',
  status: ''
})

// التحقق من صحة النموذج
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && 
         formData.value.title &&
         formData.value.category &&
         formData.value.start_date &&
         formData.value.capacity > 0 &&
         formData.value.status
})

// قواعد التحقق
const validationRules = {
  title: (value) => {
    if (!value) return 'اسم الفعالية مطلوب'
    if (value.length < 3) return 'اسم الفعالية يجب أن يكون 3 أحرف على الأقل'
    if (value.length > 100) return 'اسم الفعالية يجب أن لا يتجاوز 100 حرف'
    return null
  },
  category: (value) => {
    if (!value) return 'الفئة مطلوبة'
    return null
  },
  start_date: (value) => {
    if (!value) return 'تاريخ البدء مطلوب'
    const startDate = new Date(value)
    const now = new Date()
    if (startDate < now) return 'تاريخ البدء يجب أن يكون في المستقبل'
    return null
  },
  end_date: (value) => {
    if (value && formData.value.start_date) {
      const startDate = new Date(formData.value.start_date)
      const endDate = new Date(value)
      if (endDate <= startDate) return 'تاريخ النهاية يجب أن يكون بعد تاريخ البدء'
    }
    return null
  },
  capacity: (value) => {
    if (!value || value <= 0) return 'السعة يجب أن تكون أكبر من صفر'
    if (value > 10000) return 'السعة كبيرة جداً'
    return null
  },
  price: (value) => {
    if (value < 0) return 'السعر لا يمكن أن يكون سالباً'
    if (value > 100000) return 'السعر كبير جداً'
    return null
  },
  location: (value) => {
    if (value && value.length > 200) return 'المكان يجب أن لا يتجاوز 200 حرف'
    return null
  },
  description: (value) => {
    if (value && value.length > 1000) return 'الوصف يجب أن لا يتجاوز 1000 حرف'
    return null
  },
  status: (value) => {
    if (!value) return 'الحالة مطلوبة'
    return null
  }
}

// التحقق من حقل معين
const validateField = (fieldName) => {
  const value = formData.value[fieldName]
  const error = validationRules[fieldName]?.(value)
  
  if (error) {
    errors.value[fieldName] = error
  } else {
    delete errors.value[fieldName]
  }
}

// التحقق من كل الحقول
const validateForm = () => {
  Object.keys(validationRules).forEach(field => {
    validateField(field)
  })
  return Object.keys(errors.value).length === 0
}

// تحديث النموذج عند تغيير event
watch(() => props.event, (newEvent) => {
  if (newEvent && newEvent.id) {
    formData.value = { ...newEvent }
    errors.value = {} // مسح الأخطاء
    
    // تحويل التواريخ للتنسيق المناسب
    if (formData.value.start_date) {
      const date = new Date(formData.value.start_date)
      formData.value.start_date = date.toISOString().slice(0, 16)
    }
    if (formData.value.end_date) {
      const date = new Date(formData.value.end_date)
      formData.value.end_date = date.toISOString().slice(0, 16)
    }
    
    // التحقق من البيانات بعد التحميل
    setTimeout(() => validateForm(), 100)
  }
}, { immediate: true })

const handleClose = () => {
  errors.value = {}
  emit('close')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showToast('خطأ', 'يوجد أخطاء في النموذج، يرجى تصحيحها', 'error');
    return;
  }

  saving.value = true;
  
  try {
    if (!props.event?.id) {
      throw new Error('معرف الفعالية غير موجود');
    }

    const response = await api.put(`/admin/events/${props.event.id}`, formData.value);
    
    // إرسال البيانات وإغلاق المودال
    if (response.data && response.data.data) {
      emit('saved', response.data.data);
    } else {
      emit('saved', response.data || formData.value);
    }
    
    // لا تقم بإظهار الإشعار هنا - دعه للصفحة الرئيسية
    handleClose();
    
  } catch (error) {
    console.error('Error updating event:', error);
    
    if (error.response?.data?.errors) {
      errors.value = { ...errors.value, ...error.response.data.errors };
      showToast('خطأ', 'يوجد أخطاء في البيانات المرسلة', 'error');
    } else {
      showToast('خطأ', error.message || 'حدث خطأ أثناء تحديث الفعالية', 'error');
    }
  } finally {
    saving.value = false;
  }
}
</script>