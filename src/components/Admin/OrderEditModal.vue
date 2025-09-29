<template>
  <Modal :show="show" @close="handleClose" max-width="lg">
    <div class="p-6">
      <!-- الهيدر -->
      <div class="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 mr-3">
            <i class="fas fa-edit text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              تعديل حالة الطلب #{{ order?.id }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">تحديث حالة الطلب والدفع</p>
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
        <div class="grid grid-cols-1 gap-6">
          <!-- حالة الطلب -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حالة الطلب *
            </label>
            <select
              v-model="formData.status"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="reserved">محجوز</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <!-- حالة الدفع -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              حالة الدفع *
            </label>
            <select
              v-model="formData.payment_status"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتمل</option>
              <option value="failed">فاشل</option>
              <option value="refunded">تم الاسترداد</option>
            </select>
          </div>

          <!-- ملاحظات -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملاحظات
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="أضف ملاحظات حول التحديث..."
            ></textarea>
          </div>
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
            :disabled="saving"
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
import { ref, watch } from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const formData = ref({
  status: '',
  payment_status: '',
  notes: ''
})

// تحديث النموذج عند تغيير الطلب
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    formData.value = {
      status: newOrder.status || '',
      payment_status: newOrder.payment_status || '',
      notes: ''
    }
  }
}, { immediate: true })

const handleClose = () => {
  emit('close')
}

const handleSubmit = async () => {
  saving.value = true
  
  try {
    await api.put(`/admin/orders/${props.order.id}/status`, formData.value)
    
    emit('saved', { ...props.order, ...formData.value })
    // showToast('نجاح', 'تم تحديث حالة الطلب بنجاح', 'success')
    handleClose()
  } catch (error) {
    console.error('Error updating order:', error)
    // showToast('خطأ', 'حدث خطأ أثناء تحديث الطلب', 'error')
  } finally {
    saving.value = false
  }
}
</script>